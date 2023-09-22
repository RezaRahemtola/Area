import { Controller } from "@nestjs/common";
import { GrpcMethod } from "@nestjs/microservices";
import { Metadata, ServerUnaryCall } from "@grpc/grpc-js";
import { AreaData } from "./grpc.dto";
import { ApiExcludeController } from "@nestjs/swagger";

@ApiExcludeController()
@Controller()
export class GrpcController {
	@GrpcMethod("AreaBackService", "OnAction")
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	onAction(data: AreaData, metadata: Metadata, call: ServerUnaryCall<unknown, unknown>): void {
		console.log("OnAction", data);
	}

	@GrpcMethod("AreaBackService", "OnReaction")
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	onReaction(data: AreaData, metadata: Metadata, call: ServerUnaryCall<unknown, unknown>): void {
		console.log("OnReaction", data);
	}
}
