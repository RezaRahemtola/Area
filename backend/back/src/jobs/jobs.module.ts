import { forwardRef, Module } from "@nestjs/common";
import { GrpcModule } from "../grpc/grpc.module";
import { JobsService } from "./jobs.service";
import { WorkflowsModule } from "../workflows/workflows.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import WorkflowArea from "../workflows/entities/workflow-area.entity";
import { ConnectionsModule } from "../connections/connections.module";

@Module({
	imports: [
		TypeOrmModule.forFeature([WorkflowArea]),
		ConnectionsModule,
		forwardRef(() => WorkflowsModule),
		forwardRef(() => GrpcModule),
	],
	controllers: [],
	providers: [JobsService],
	exports: [JobsService],
})
export class JobsModule {}
