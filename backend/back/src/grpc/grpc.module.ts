import { Module } from "@nestjs/common";
import { GrpcController } from "./grpc.controller";
import { GrpcService } from "./grpc.service";

@Module({
	imports: [],
	controllers: [GrpcController],
	providers: [GrpcService],
  exports: [GrpcService],
})
export class GrpcModule {}
