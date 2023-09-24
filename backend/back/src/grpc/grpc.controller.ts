import { Controller } from "@nestjs/common";
import { GrpcMethod } from "@nestjs/microservices";
import { Metadata, ServerUnaryCall } from "@grpc/grpc-js";
import { AreaData } from "./grpc.dto";
import { ApiExcludeController } from "@nestjs/swagger";

@ApiExcludeController()
@Controller()
export class GrpcController {
	@GrpcMethod("AreaBackService", "OnAction")
	onAction(data: AreaData): void {
		console.log("OnAction", data);
	}

	@GrpcMethod("AreaBackService", "OnReaction")
	onReaction(data: AreaData): void {
		console.log("OnReaction", data);
	}
}
