import { Module } from "@nestjs/common";
import { GrpcController } from "./grpc.controller";
import { GrpcService } from "./grpc.service";
import { ClientsModule, Transport } from "@nestjs/microservices";

@Module({
	imports: [
		ClientsModule.register([
			{
				name: "AREA_SUPERVISOR_PACKAGE",
				transport: Transport.GRPC,
				options: {
					url: "localhost:50051",
					package: "area_supervisor",
					protoPath: "proto/area_supervisor.proto",
					loader: {
						objects: true,
					},
				},
			},
		]),
	],
	controllers: [GrpcController],
	providers: [GrpcService],
	exports: [GrpcService],
})
export class GrpcModule {}
