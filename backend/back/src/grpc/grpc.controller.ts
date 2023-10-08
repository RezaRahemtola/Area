import { Controller, forwardRef, Inject } from "@nestjs/common";
import { GrpcMethod } from "@nestjs/microservices";
import { ApiExcludeController } from "@nestjs/swagger";
import { JobData } from "./grpc.dto";
import { JobsService } from "../jobs/jobs.service";

@ApiExcludeController()
@Controller()
export class GrpcController {
	constructor(@Inject(forwardRef(() => JobsService)) private readonly jobsService: JobsService) {}

	@GrpcMethod("AreaBackService", "OnAction")
	async onAction(data: JobData): Promise<void> {
		console.log("OnAction", data);
		await this.jobsService.launchNextJob(data);
	}

	@GrpcMethod("AreaBackService", "OnReaction")
	async onReaction(data: JobData): Promise<void> {
		console.log("OnReaction", data);
		await this.jobsService.launchNextJob(data);
	}
}
