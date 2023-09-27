import { Inject, Injectable, OnModuleInit } from "@nestjs/common";
import { ClientGrpc } from "@nestjs/microservices";
import { GrpcResponse, JobData } from "./grpc.dto";
import { firstValueFrom, Observable } from "rxjs";
import { JobsType } from "../types/jobs";
import { JobsParams } from "../types/jobParams";
import { JobsIdentifiers } from "../types/jobIds";
import "../types/struct";

interface AreaSupervisorService {
	launchJob(data: JobData): Observable<GrpcResponse>;
}

@Injectable()
export class GrpcService implements OnModuleInit {
	private areaSupervisorService: AreaSupervisorService;

	constructor(@Inject("AREA_SUPERVISOR_PACKAGE") private readonly client: ClientGrpc) {}

	onModuleInit() {
		this.areaSupervisorService = this.client.getService<AreaSupervisorService>("AreaSupervisorService");
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
}
