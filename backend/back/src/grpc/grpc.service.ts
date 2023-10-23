import { forwardRef, Inject, Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { ClientGrpc } from "@nestjs/microservices";
import { AuthenticatedJobData, GrpcResponse, JobId, JobList } from "./grpc.dto";
import { firstValueFrom, Observable } from "rxjs";
import { JobsParams, JobsType } from "../types/jobs";
import { JobsIdentifiers } from "../types/jobIds";
import "../types/struct";
import { JobsService } from "../jobs/jobs.service";

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
	) {}

	async onModuleInit() {
		this.logger.log("Synchronizing jobs...");
		this.areaSupervisorService = this.client.getService<AreaSupervisorService>("AreaSupervisorService");
		await this.jobsService.synchronizeJobs();
	}

	launchJob<TJob extends JobsType, TParams extends JobsParams["mappings"][TJob]>(
		name: TJob,
		params: TParams,
		auth: unknown,
	): Promise<GrpcResponse> {
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
}
