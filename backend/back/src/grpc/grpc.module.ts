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
					package: "area_supervisor",
					protoPath: "proto/area_supervisor.proto",
				},
			},
		]),
	],
	controllers: [GrpcController],
	providers: [GrpcService],
	exports: [GrpcService],
})
export class GrpcModule {}
