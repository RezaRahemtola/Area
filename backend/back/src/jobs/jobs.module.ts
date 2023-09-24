import { Module } from "@nestjs/common";
import { GrpcModule } from "../grpc/grpc.module";
import { JobsController } from "./jobs.controller";
import { JobsService } from "./jobs.service";

@Module({
	imports: [GrpcModule],
	controllers: [JobsController],
	providers: [JobsService],
})
export class JobsModule {}
