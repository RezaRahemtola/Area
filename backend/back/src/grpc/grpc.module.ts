import { Module } from "@nestjs/common";
import { GrpcController } from "./grpc.controller";
import { GrpcService } from "./grpc.service";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { ConfigModule, ConfigService } from "@nestjs/config";

@Module({
	imports: [
		ClientsModule.registerAsync([
			{
				name: "AREA_SUPERVISOR_PACKAGE",
				imports: [ConfigModule],
				inject: [ConfigService],
				useFactory: async (config: ConfigService) => ({
					transport: Transport.GRPC,
					options: {
						url: `${config.getOrThrow<string>("SUPERVISOR_HOST")}:${config.getOrThrow<string>("SUPERVISOR_PORT")}`,
						package: "area_supervisor",
						protoPath: "proto/area_supervisor.proto",
						loader: {
							objects: true,
						},
					},
				}),
			},
		]),
	],
	controllers: [GrpcController],
	providers: [GrpcService],
	exports: [GrpcService],
})
export class GrpcModule {}
