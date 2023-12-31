import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { version } from "package.json";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";

async function bootstrap() {
	const app = await NestFactory.create(AppModule, {
		rawBody: true,
	});
	app.connectMicroservice<MicroserviceOptions>({
		transport: Transport.GRPC,
		options: {
			url: "0.0.0.0:50050",
			package: "area_back",
			protoPath: "proto/area_back.proto",
		},
	});

	const config = new DocumentBuilder()
		.setTitle("AREA API")
		.setDescription("AREA Internal API")
		.setVersion(version)
		.addBearerAuth({ type: "http", scheme: "bearer", bearerFormat: "JWT" })
		.build();
	const document = SwaggerModule.createDocument(app, config);

	SwaggerModule.setup("documentation", app, document);

	app.enableCors();
	app.useGlobalPipes(
		new ValidationPipe({
			transform: true,
			transformOptions: {
				enableImplicitConversion: true,
			},
			whitelist: true,
			forbidNonWhitelisted: true,
		}),
	);

	await app.startAllMicroservices();
	await app.listen(3000);
}

bootstrap();
