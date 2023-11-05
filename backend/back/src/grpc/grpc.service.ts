import { forwardRef, Inject, Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { ClientGrpc } from "@nestjs/microservices";
import { AuthenticatedJobData, GrpcResponse, JobData, JobId, JobList } from "./grpc.dto";
import { firstValueFrom, Observable } from "rxjs";
import { JobsParams, JobsType } from "../types/jobs";
import { JobsIdentifiers } from "../types/jobIds";
import "../types/struct";
import { JobsService } from "../jobs/jobs.service";
import { ActivityService } from "../activity/activity.service";

interface AreaSupervisorService {
	launchJob(data: AuthenticatedJobData): Observable<GrpcResponse>;

	killJob(job: JobId): Observable<GrpcResponse>;

	killAllJobs(_: object): Observable<GrpcResponse>;

	listJobs(_: object): Observable<JobList>;
}

@Injectable()
export class GrpcService implements OnModuleInit {
	private areaSupervisorService: AreaSupervisorService;
	private readonly logger = new Logger(GrpcService.name);

	constructor(
		@Inject("AREA_SUPERVISOR_PACKAGE") private readonly client: ClientGrpc,
		@Inject(forwardRef(() => JobsService)) private readonly jobsService: JobsService,
		private readonly activityService: ActivityService,
	) {}

	async onModuleInit() {
		this.logger.log("Synchronizing jobs...");
		this.areaSupervisorService = this.client.getService<AreaSupervisorService>("AreaSupervisorService");
		await this.jobsService.synchronizeJobs();
	}

	launchJob<TJob extends JobsType>(name: TJob, params: JobsParams[TJob], auth: unknown): Promise<GrpcResponse> {
		const identifier = JobsIdentifiers[name](params);
		this.logger.log(
			`Launching job ${identifier} with name ${name} and params ${JSON.stringify({
				params,
			})} and auth params ${JSON.stringify({ auth })}`,
		);
		return firstValueFrom(
			this.areaSupervisorService.launchJob({
				name,
				identifier,
				params,
				auth,
			}),
		);
	}

	killJob(identifier: string) {
		this.logger.log(`Killing job ${identifier}`);
		return firstValueFrom(
			this.areaSupervisorService.killJob({
				identifier,
			}),
		);
	}

	killAllJobs() {
		this.logger.log("Killing all jobs");
		return firstValueFrom(this.areaSupervisorService.killAllJobs({}));
	}

	listJobs() {
		this.logger.log("Listing all jobs");
		return firstValueFrom(this.areaSupervisorService.listJobs({}));
	}

	async onAction(data: JobData) {
		this.logger.log(`Received action job data ${JSON.stringify(data, undefined, 2)}`);
		await this.activityService.createActivityLogsForJobIdentifier("ran", data.identifier);
		await this.jobsService.launchNextJob(data);

		if (data.name === "area-on-action") return;
		const owners = await this.jobsService.getWorkflowOwnersForJob(data.identifier);
		for (const owner of owners) {
			await this.onAction({
				name: "area-on-action",
				identifier: `area-on-action-${owner}`,
				params: {
					name: data.name,
				},
			});
		}
	}

	async onReaction(data: JobData) {
		this.logger.log(`Received reaction job data ${JSON.stringify(data, undefined, 2)}`);
		await this.activityService.createActivityLogsForJobIdentifier("ran", data.identifier);
		await this.jobsService.launchNextJob(data);
	}

	async onError(data: JobData) {
		this.logger.error(`Received error job data ${JSON.stringify(data, undefined, 2)}`);
		await this.activityService.createActivityLogsForJobIdentifier("error", data.identifier);
	}
}
