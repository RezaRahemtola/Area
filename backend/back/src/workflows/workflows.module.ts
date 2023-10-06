import { Module } from "@nestjs/common";
import { WorkflowsService } from "./workflows.service";
import { WorkflowsController } from "./workflows.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import Workflow from "./entities/workflow.entity";
import WorkflowArea from "./entities/workflow-area.entity";
import Area from "../services/entities/area.entity";
import { User } from "../users/entities/user.entity";

@Module({
	imports: [TypeOrmModule.forFeature([Workflow, WorkflowArea, Area, User])],
	controllers: [WorkflowsController],
	providers: [WorkflowsService],
})
export class WorkflowsModule {}
