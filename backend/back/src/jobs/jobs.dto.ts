import { IsEnum, IsObject } from "class-validator";
import { Jobs, JobsType } from "../types/jobs";
import { ApiProperty } from "@nestjs/swagger";

export class LaunchJobDto {
	@ApiProperty({ enum: Jobs })
	@IsEnum(Jobs)
	job: JobsType;

	@ApiProperty()
	@IsObject()
	params: unknown;
}
