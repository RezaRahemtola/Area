import { BadRequestException, forwardRef, HttpException, Inject, Injectable } from "@nestjs/common";
import { GrpcService } from "../grpc/grpc.service";
import { LaunchJobDto } from "./jobs.dto";
import { JobParamsClasses, JobsParams, JobsType } from "../types/jobs";
import { validate } from "class-validator";
import { plainToInstance } from "class-transformer";
import { WorkflowsService } from "../workflows/workflows.service";
import { InjectRepository } from "@nestjs/typeorm";
import WorkflowArea from "../workflows/entities/workflow-area.entity";
import { Repository } from "typeorm";
import { JobData } from "../grpc/grpc.dto";
import { RuntimeException } from "@nestjs/core/errors/exceptions";

@Injectable()
export class JobsService {
	constructor(
		@Inject(forwardRef(() => GrpcService)) private readonly grpcService: GrpcService,
		@Inject(forwardRef(() => WorkflowsService)) private readonly workflowsService: WorkflowsService,
		@InjectRepository(WorkflowArea) private readonly workflowAreaRepository: Repository<WorkflowArea>,
	) {}

	async getActionJobsToStart(): Promise<JobData[]> {
		return (await this.workflowsService.getWorkflowsWithAreas(undefined, true)).map(
			({ action: { areaId, areaServiceId, jobId: identifier, parameters: params } }) => ({
				name: `${areaServiceId}-${areaId}`,
				identifier,
				params,
			}),
		);
	}

	async getReactionsForJob(jobId: string): Promise<JobData[]> {
		return (
			await this.workflowAreaRepository.find({
				where: { jobId },
				relations: { nextWorkflowReactions: true },
			})
		).flatMap(({ nextWorkflowReactions }) =>
			nextWorkflowReactions.map(({ area, jobId: identifier, parameters: params }) => ({
				name: `${area.serviceId}-${area.id}`,
				identifier,
				params,
			})),
		);
	}

	async convertParams<TJobs extends JobsType>(job: JobsType, params: unknown): Promise<JobsParams["mappings"][TJobs]> {
		const data = plainToInstance<object, unknown>(JobParamsClasses[job], params);
		let errors = [];

		try {
			errors = await validate(data, {
				whitelist: true,
				always: true,
				forbidUnknownValues: true,
				forbidNonWhitelisted: true,
				stopAtFirstError: true,
			});
		} catch (e) {
			throw new BadRequestException("Invalid job parameters");
		}
		if (errors.length > 0) {
			const message = Object.values(errors[0].constraints)[0];
			throw new BadRequestException(`Invalid job parameters: ${message}`);
		}
		return data as JobsParams["mappings"][TJobs];
	}

	async launchJob(job: LaunchJobDto): Promise<void> {
		const params = await this.convertParams(job.job, job.params);
		const response = await this.grpcService.launchJob(job.job, params);

		if (response.error) {
			throw new HttpException(response.error.message, response.error.code);
		}
	}

	async synchronizeJobs(): Promise<void> {
		const jobs = await this.getActionJobsToStart();

		const res = await this.grpcService.killAllJobs();
		if (res.error) {
			throw new RuntimeException(`Error while synchronizing: ${res.error.message}`);
		}

		for (const job of jobs) {
			const jobType: JobsType = job.name as JobsType;
			const params = await this.convertParams(jobType as JobsType, job.params);
			const response = await this.grpcService.launchJob(jobType, params);

			if (response.error) {
				throw new RuntimeException(`Error while synchronizing: ${response.error.message}`);
			}
		}
	}
}
