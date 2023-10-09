import { forwardRef, Inject, Injectable, OnModuleInit } from "@nestjs/common";
import { ClientGrpc } from "@nestjs/microservices";
import { GrpcResponse, JobData, JobId, JobList } from "./grpc.dto";
import { firstValueFrom, Observable } from "rxjs";
import { JobsParams, JobsType } from "../types/jobs";
import { JobsIdentifiers } from "../types/jobIds";
import "../types/struct";
import { JobsService } from "../jobs/jobs.service";

interface AreaSupervisorService {
	launchJob(data: JobData): Observable<GrpcResponse>;
	killJob(job: JobId): Observable<GrpcResponse>;
	killAllJobs(_: object): Observable<GrpcResponse>;
	listJobs(_: object): Observable<JobList>;
}

@Injectable()
export class GrpcService implements OnModuleInit {
	private areaSupervisorService: AreaSupervisorService;

	constructor(
		@Inject("AREA_SUPERVISOR_PACKAGE") private readonly client: ClientGrpc,
		@Inject(forwardRef(() => JobsService)) private readonly jobsService: JobsService,
	) {}

	async onModuleInit() {
		this.areaSupervisorService = this.client.getService<AreaSupervisorService>("AreaSupervisorService");
		await this.jobsService.synchronizeJobs();
	}

	launchJob<TJob extends JobsType, TParams extends JobsParams["mappings"][TJob]>(
		name: TJob,
		params: TParams,
	): Promise<GrpcResponse> {
		const identifier = JobsIdentifiers[name](params);
		return firstValueFrom(
			this.areaSupervisorService.launchJob({
				name,
				identifier,
				params,
			}),
		);
	}

	killJob(identifier: string) {
		return firstValueFrom(
			this.areaSupervisorService.killJob({
				identifier,
			}),
		);
	}

	killAllJobs() {
		return firstValueFrom(this.areaSupervisorService.killAllJobs({}));
	}

	listJobs() {
		return firstValueFrom(this.areaSupervisorService.listJobs({}));
	}
}
