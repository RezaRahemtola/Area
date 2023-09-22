import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { version } from "package.json";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.connectMicroservice<MicroserviceOptions>({
		transport: Transport.GRPC,
		options: {
			package: "area_back",
			protoPath: "src/grpc/proto/area_back.proto",
		},
	});

	const config = new DocumentBuilder()
		.setTitle("AREA API")
		.setDescription("AREA Internal API")
		.setVersion(version)
		.build();
	const document = SwaggerModule.createDocument(app, config);

	SwaggerModule.setup("api", app, document);

	app.enableCors();
	app.useGlobalPipes(new ValidationPipe({ transform: true }));

	await app.startAllMicroservices();
	await app.listen(3000);
}
bootstrap();
