import { Controller } from "@nestjs/common";
import { GrpcMethod } from "@nestjs/microservices";
import { ApiExcludeController } from "@nestjs/swagger";
import { JobData } from "./grpc.dto";

@ApiExcludeController()
@Controller()
export class GrpcController {
	@GrpcMethod("AreaBackService", "OnAction")
	onAction(data: JobData): void {
		console.log("OnAction", data);
	}

	@GrpcMethod("AreaBackService", "OnReaction")
	onReaction(data: JobData): void {
		console.log("OnReaction", data);
	}
}
