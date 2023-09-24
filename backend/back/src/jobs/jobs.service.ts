import { Injectable } from "@nestjs/common";
import { GrpcService } from "../grpc/grpc.service";
import { firstValueFrom } from "rxjs";
import { Jobs } from "../types/jobs";
import { JobsParams } from "../types/jobParams";

@Injectable()
export class JobsService {
	constructor(
		private readonly grpcService: GrpcService,
	) {}

	async launchJob<
		TJob extends Jobs,
		TParams extends JobsParams["mappings"][TJob]
	>(name: TJob, params: TParams): Promise<void> {
		await firstValueFrom(this.grpcService.launchJob(name, params))
		return Promise.resolve()
	}
}
