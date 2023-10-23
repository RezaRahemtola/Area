import { Controller, forwardRef, Inject, Logger } from "@nestjs/common";
import { GrpcMethod } from "@nestjs/microservices";
import { ApiExcludeController } from "@nestjs/swagger";
import { JobData } from "./grpc.dto";
import { JobsService } from "../jobs/jobs.service";

@ApiExcludeController()
@Controller()
export class GrpcController {
	private readonly logger = new Logger(GrpcController.name);

	constructor(@Inject(forwardRef(() => JobsService)) private readonly jobsService: JobsService) {}

	@GrpcMethod("AreaBackService", "OnAction")
	async onAction(data: JobData): Promise<void> {
		this.logger.log(`Received action job data ${JSON.stringify(data, undefined, 2)}`);
		await this.jobsService.launchNextJob(data);
	}

	@GrpcMethod("AreaBackService", "OnReaction")
	async onReaction(data: JobData): Promise<void> {
		this.logger.log(`Received reaction job data ${JSON.stringify(data, undefined, 2)}`);
		await this.jobsService.launchNextJob(data);
	}

	@GrpcMethod("AreaBackService", "OnError")
	async onError(data: JobData): Promise<void> {
		this.logger.error(`Received error job data ${JSON.stringify(data, undefined, 2)}`);
	}
}
