import { Injectable } from "@nestjs/common";
import { GrpcService } from "../grpc/grpc.service";
import { LaunchJobDto } from "./jobs.dto";

@Injectable()
export class JobsService {
	constructor(private readonly grpcService: GrpcService) {}

	async launchJob(job: LaunchJobDto): Promise<void> {}
}
