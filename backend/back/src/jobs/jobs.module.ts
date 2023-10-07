import { Module } from "@nestjs/common";
import { GrpcModule } from "../grpc/grpc.module";
import { JobsService } from "./jobs.service";

@Module({
	imports: [GrpcModule],
	controllers: [],
	providers: [JobsService],
})
export class JobsModule {}
