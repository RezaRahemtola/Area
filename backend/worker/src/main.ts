import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";

async function bootstrap() {
	const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
		transport: Transport.GRPC,
		options: {
			url: "localhost:50051",
			package: "area_worker",
			protoPath: "src/grpc/proto/area_worker.proto",
		},
	});

	await app.listen();
}
bootstrap();
