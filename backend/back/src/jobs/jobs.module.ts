import { forwardRef, Module } from "@nestjs/common";
import { GrpcModule } from "../grpc/grpc.module";
import { JobsService } from "./jobs.service";
import { WorkflowsModule } from "../workflows/workflows.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import WorkflowArea from "../workflows/entities/workflow-area.entity";

@Module({
	imports: [GrpcModule, WorkflowsModule, TypeOrmModule.forFeature([WorkflowArea]), forwardRef(() => WorkflowsModule)],
	controllers: [],
	providers: [JobsService],
	exports: [JobsService],
})
export class JobsModule {}
