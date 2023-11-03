import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsDate, IsEnum, IsInt, IsOptional, Min } from "class-validator";
import { ACTIVITY_LOG_TYPES, ActivityLogType } from "../entities/activity-log.entity";

export default class ActivityLogGetterParamsDto {
	@ApiPropertyOptional({
		description: "The date to get activity logs since",
	})
	@IsOptional()
	@IsDate()
	since?: Date;

	@ApiPropertyOptional({
		description: "The page of the activity logs (starting at 0), if not provided, it will be 0",
		default: 0,
	})
	@IsOptional()
	@Min(0)
	@IsInt()
	page?: number;

	@ApiPropertyOptional({
		description: "The number of activity logs per page, if not provided and page set, it will be 10",
		default: 10,
	})
	@IsOptional()
	@Min(1)
	@IsInt()
	itemsPerPage?: number;

	@ApiPropertyOptional({
		description: "The type of the activity logs to get",
	})
	@IsOptional()
	@IsEnum(ACTIVITY_LOG_TYPES)
	type?: ActivityLogType;
}
