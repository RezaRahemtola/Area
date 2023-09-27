import { IsEnum, IsObject } from "class-validator";
import { Jobs, JobsType } from "../types/jobs";
import { ApiProperty } from "@nestjs/swagger";
import { JobsParams } from "../types/jobParams";

export class LaunchJobDto {
	@ApiProperty({ enum: Jobs })
	@IsEnum(Jobs)
	job: JobsType;

	@ApiProperty()
	@IsObject()
	params: unknown;
}
