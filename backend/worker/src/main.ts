import { NestFactory } from "@nestjs/core";
import { AppModule } from "./services/app.module";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";

async function bootstrap() {
	const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
		transport: Transport.GRPC,
		options: {
			package: "area_worker",
			protoPath: "src/grpc/area_worker.proto",
		}
	});

	await app.listen();
}
bootstrap();
