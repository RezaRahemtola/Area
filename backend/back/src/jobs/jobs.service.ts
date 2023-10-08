import { BadRequestException, HttpException, Injectable } from "@nestjs/common";
import { GrpcService } from "../grpc/grpc.service";
import { LaunchJobDto } from "./jobs.dto";
import { JobParamsClasses, JobsParams, JobsType } from "../types/jobs";
import { validate } from "class-validator";
import { plainToInstance } from "class-transformer";
import { WorkflowsService } from "../workflows/workflows.service";
import { InjectRepository } from "@nestjs/typeorm";
import WorkflowArea from "../workflows/entities/workflow-area.entity";
import { Repository } from "typeorm";

@Injectable()
export class JobsService {
	constructor(
		private readonly grpcService: GrpcService,
		private readonly workflowsService: WorkflowsService,
		@InjectRepository(WorkflowArea)
		private readonly workflowAreaRepository: Repository<WorkflowArea>,
	) {}

	async getActionJobsToStart() {
		return (await this.workflowsService.getWorkflowsWithAreas(undefined, true)).map(
			({ action: { jobId, parameters } }) => ({ jobId, params: parameters }),
		);
	}

	async getReactionsForJob(jobId: string) {
		return (
			await this.workflowAreaRepository.find({
				where: { jobId },
				relations: { nextWorkflowReactions: true },
			})
		).map(({ nextWorkflowReactions }) => nextWorkflowReactions.map(({ jobId, parameters }) => ({ jobId, parameters })));
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
}
