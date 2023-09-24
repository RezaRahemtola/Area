import { Module } from "@nestjs/common";
import { GrpcController } from "./grpc.controller";
import { GrpcService } from "./grpc.service";
import { ClientsModule, Transport } from "@nestjs/microservices";

@Module({
	imports: [ClientsModule.register([{
		name: "WORKER_PACKAGE",
		transport: Transport.GRPC,
		options: {
			url: "localhost:50051",
			package: "area_worker",
			protoPath: "src/grpc/proto/area_worker.proto",
		}
	}])],
	exports: [GrpcService],
	controllers: [GrpcController],
	providers: [GrpcService],
})
export class GrpcModule {}
