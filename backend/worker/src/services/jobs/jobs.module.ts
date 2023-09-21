import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { JobsController } from "./jobs.controller";
import JobsService from "./jobs.service";

@Module({
	imports: [ClientsModule.register([
		{
			name: "BACK_PACKAGE",
			transport: Transport.GRPC,
			options: {
				package: "area_back",
				protoPath: "src/grpc/area_back.proto",
			}
		}
	])],
	controllers: [JobsController],
	providers: [JobsService],
})
export class AppModule {}
