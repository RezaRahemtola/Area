import { Controller, Get, Query, Req, UseGuards } from "@nestjs/common";
import { ActivityService } from "./activity.service";
import { ApiBearerAuth, ApiProduces, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import ActivityLogGetterParamsDto from "./dto/activity-log-getter-params.dto";
import { APIRequest } from "../types/request";

@ApiTags("Activity logs")
@ApiProduces("application/json")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("activity")
export class ActivityController {
	constructor(private readonly activityService: ActivityService) {}

	@Get()
	async getActivityLogs(@Req() { user: { id: userId } }: APIRequest, @Query() params: ActivityLogGetterParamsDto) {
		return this.activityService.getActivityLogs(params, userId);
	}
}
