import { Controller } from "@nestjs/common";
import { GrpcMethod } from "@nestjs/microservices";
import { ApiExcludeController } from "@nestjs/swagger";
import { JobData } from "./grpc.dto";
import { GrpcService } from "./grpc.service";

@ApiExcludeController()
@Controller()
export class GrpcController {
	constructor(private readonly grpcService: GrpcService) {}

	@GrpcMethod("AreaBackService", "OnAction")
	async onAction(data: JobData): Promise<void> {
		await this.grpcService.onAction(data);
	}

	@GrpcMethod("AreaBackService", "OnReaction")
	async onReaction(data: JobData): Promise<void> {
		await this.grpcService.onReaction(data);
	}

	@GrpcMethod("AreaBackService", "OnError")
	async onError(data: JobData): Promise<void> {
		await this.grpcService.onError(data);
	}
}
