import { forwardRef, Module } from "@nestjs/common";
import { WorkflowsService } from "./workflows.service";
import { WorkflowsController } from "./workflows.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import Workflow from "./entities/workflow.entity";
import WorkflowArea from "./entities/workflow-area.entity";
import Area from "../services/entities/area.entity";
import { User } from "../users/entities/user.entity";
import { JobsModule } from "../jobs/jobs.module";

@Module({
	imports: [TypeOrmModule.forFeature([Workflow, WorkflowArea, Area, User]), forwardRef(() => JobsModule)],
	controllers: [WorkflowsController],
	providers: [WorkflowsService],
	exports: [WorkflowsService],
})
export class WorkflowsModule {}
