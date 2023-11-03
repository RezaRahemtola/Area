import { Module } from "@nestjs/common";
import { ActivityService } from "./activity.service";
import { ActivityController } from "./activity.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import ActivityLog from "./entities/activity-log.entity";
import WorkflowArea from "../workflows/entities/workflow-area.entity";

@Module({
	imports: [TypeOrmModule.forFeature([ActivityLog, WorkflowArea])],
	controllers: [ActivityController],
	providers: [ActivityService],
	exports: [ActivityService],
})
export class ActivityModule {}
