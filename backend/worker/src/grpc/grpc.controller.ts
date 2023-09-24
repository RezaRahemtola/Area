import { Controller } from "@nestjs/common";
import { GrpcMethod } from "@nestjs/microservices";
import { AreaData } from "./grpc.dto";

@Controller()
export class GrpcController {
	@GrpcMethod("AreaWorkerService", "LaunchJob")
	launchJob(data: AreaData): void {
		console.log("LaunchJob", data);
	}

	@GrpcMethod("AreaWorkerService", "KillJob")
	killJob(data: AreaData): void {
		console.log("KillJob", data);
	}
}
