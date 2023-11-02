import { BadRequestException, forwardRef, Inject, Injectable, Logger } from "@nestjs/common";
import { GrpcService } from "../grpc/grpc.service";
import { JobParamsClasses, JobsParams, JobsType } from "../types/jobs";
import { validate } from "class-validator";
import { plainToInstance } from "class-transformer";
import { WorkflowsService } from "../workflows/workflows.service";
import { InjectRepository } from "@nestjs/typeorm";
import WorkflowArea from "../workflows/entities/workflow-area.entity";
import { Repository } from "typeorm";
import { AuthenticatedJobData, JobData } from "../grpc/grpc.dto";
import { RuntimeException } from "@nestjs/core/errors/exceptions";
import { ConnectionsService } from "../connections/connections.service";
import { uniqBy } from "lodash";

@Injectable()
export class JobsService {
	private readonly logger = new Logger(JobsService.name);

	constructor(
		private readonly connectionsService: ConnectionsService,
		@Inject(forwardRef(() => GrpcService)) private readonly grpcService: GrpcService,
		@Inject(forwardRef(() => WorkflowsService)) private readonly workflowsService: WorkflowsService,
		@InjectRepository(WorkflowArea) private readonly workflowAreaRepository: Repository<WorkflowArea>,
	) {}

	getJobName(areaServiceId: string, areaId: string): JobsType {
		return `${areaServiceId}-${areaId}` as JobsType;
	}

	async getWorkflowAreasForJobId(jobId: string, isWorkflowActive: boolean = true) {
		const areas = await this.workflowAreaRepository.find({
			where: { jobId },
			relations: { workflow: true, actionOfWorkflow: true },
		});

		const filteredAreas = areas.filter(
			({ workflow, actionOfWorkflow }) =>
				(workflow && workflow.active === isWorkflowActive) ||
				(actionOfWorkflow && actionOfWorkflow.active === isWorkflowActive),
		);
		this.logger.log(
			`Found ${filteredAreas.length} ${isWorkflowActive ? "active " : ""}workflow areas for job ${jobId}`,
		);
		return filteredAreas;
	}

	async getActionJobsToStart(): Promise<AuthenticatedJobData[]> {
		const workflows = await this.workflowsService.getWorkflowsWithAreas(undefined, true);
		this.logger.log(`Found ${workflows.length} workflows to start`);
		return Promise.all(
			workflows.map(async ({ ownerId, action: { areaId, areaServiceId, jobId: identifier, parameters: params } }) => {
				const connection = await this.connectionsService.getUserConnectionForService(ownerId, areaServiceId);

				return {
					name: this.getJobName(areaServiceId, areaId),
					identifier,
					params,
					auth: connection?.data ?? {},
				};
			}),
		);
	}

	async getReactionsForJob(jobId: string): Promise<AuthenticatedJobData[]> {
		const jobs = await this.workflowAreaRepository.find({
			where: { jobId },
			relations: { nextWorkflowReactions: { area: true }, workflow: true, actionOfWorkflow: true },
		});
		const nextJobs = await Promise.all(
			jobs.flatMap(async (job) => {
				return Promise.all(
					job.nextWorkflowReactions.map(async ({ jobId: identifier, parameters: params, area }) => {
						const ownerId = job.actionOfWorkflow?.ownerId ?? job.workflow.ownerId;
						const connection = await this.connectionsService.getUserConnectionForService(ownerId, area.serviceId);

						return {
							name: this.getJobName(area.serviceId, area.id),
							identifier,
							params,
							auth: connection?.data ?? {},
						};
					}),
				);
			}),
		);

		const reactionJobs = nextJobs.flat();
		this.logger.log(`Found ${reactionJobs.length} reactions for job ${jobId}`);
		return reactionJobs;
	}

	async convertParams<TJobs extends JobsType>(job: JobsType, params: unknown): Promise<JobsParams["mappings"][TJobs]> {
		const data = plainToInstance<object, unknown>(JobParamsClasses[job], params);
		let errors = [];

		this.logger.debug(`Validating job parameters: ${JSON.stringify(data)}`);

		try {
			errors = await validate(data, {
				whitelist: true,
				always: true,
				forbidUnknownValues: true,
				forbidNonWhitelisted: true,
				stopAtFirstError: true,
			});
		} catch (e) {
			this.logger.error(`Error while validating job parameters: ${e.message}`);
			throw new BadRequestException("Invalid job parameters");
		}
		if (errors.length > 0) {
			const message = Object.values(errors[0].constraints)[0] as string;
			throw new BadRequestException(`Invalid job parameters: ${message}`);
		}
		return data as JobsParams["mappings"][TJobs];
	}

	async launchJobs(jobs: AuthenticatedJobData[]): Promise<void> {
		const uniqueJobs = uniqBy(jobs, (job) => job.identifier);

		this.logger.log(`Launching ${uniqueJobs.length} jobs`);
		for (const job of uniqueJobs) {
			const jobType: JobsType = job.name as JobsType;
			const params = await this.convertParams(jobType, job.params);
			const response = await this.grpcService.launchJob(jobType, params, job.auth);

			if (response.error) {
				// TODO: Error handling in db & front
				throw new RuntimeException(`Error while launching job: ${response.error.message}`);
			}
		}
	}

	replaceParamsInJob(oldJob: unknown, params: unknown): unknown {
		const blacklist = ["auth", "identifier", "workflowStepId"];
		const oldJobKeys = Object.keys(oldJob);

		for (const [key, value] of Object.entries(params)) {
			if (typeof value === "string") {
				for (const oldJobKey of oldJobKeys.filter((key) => !blacklist.includes(key))) {
					params[key] = params[key].replaceAll(`$${oldJobKey}`, oldJob[oldJobKey]);
				}
			}
		}
		return params;
	}

	async launchNextJob(data: JobData): Promise<void> {
		const jobs = await this.getReactionsForJob(data.identifier);
		this.logger.log(`Launching next ${jobs} jobs for job ${data.identifier}`);
		for (const job of jobs) {
			job.params = this.replaceParamsInJob(data.params, job.params);
		}
		await this.launchJobs(jobs);
	}

	async launchWorkflowAction(workflowId: string, ownerId: string) {
		const { action } = await this.workflowsService.getWorkflowWithAreas(workflowId, undefined, true);
		const connection = await this.connectionsService.getUserConnectionForService(ownerId, action.areaServiceId);

		const job: AuthenticatedJobData = {
			name: this.getJobName(action.areaServiceId, action.areaId),
			identifier: action.jobId,
			params: action.parameters,
			auth: connection?.data ?? {},
		};
		this.logger.log(`Launching workflow action job ${job.identifier} for workflow ${workflowId}`);
		await this.launchJobs([job]);
	}

	async stopWorkflowActionIfNecessary(workflowId: string) {
		const workflowAction = await this.workflowAreaRepository.findOne({
			where: { actionOfWorkflow: { id: workflowId } },
			relations: { actionOfWorkflow: true },
		});

		return this.stopJobIdIfNecessary(workflowAction.jobId);
	}

	async stopJobIdIfNecessary(jobId: string) {
		const actionsWithJobId = await this.getWorkflowAreasForJobId(jobId);

		if (actionsWithJobId.length === 0) {
			this.logger.log(`No more active areas for job ${jobId}, stopping it`);
			const res = await this.grpcService.killJob(jobId);
			if (res.error) {
				throw new RuntimeException(`Error while stopping job: ${res.error.message}`);
			}
		}
	}

	async synchronizeJobs(): Promise<void> {
		const jobs = await this.getActionJobsToStart();

		this.logger.log(`Found ${jobs.length} jobs to start`);
		const res = await this.grpcService.killAllJobs();
		if (res.error) {
			throw new RuntimeException(`Error while synchronizing: ${res.error.message}`);
		}
		await this.launchJobs(jobs);
	}
}
