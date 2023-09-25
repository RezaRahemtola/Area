import { Body, Controller, Post } from "@nestjs/common";
import { JobsService } from "./jobs.service";
import { ApiOperation } from "@nestjs/swagger";
import { LaunchJobDto } from "./jobs.dto";

@Controller("jobs")
export class JobsController {
	constructor(private readonly jobsService: JobsService) {}

	@ApiOperation({ summary: "DEV - TO BE REMOVED" })
	@Post("launch")
	launchJob(@Body() body: LaunchJobDto): void {
		this.jobsService.launchJob(body);
	}
}
