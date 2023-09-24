import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { GrpcModule } from "./grpc/grpc.module";
import { JobsModule } from "./jobs/jobs.module";

@Module({
	imports: [
		ConfigModule.forRoot({
			envFilePath: [".env"],
		}),
		TypeOrmModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: (config: ConfigService) => ({
				type: "postgres",
				host: config.getOrThrow<string>("DB_HOST"),
				port: config.getOrThrow<number>("DB_PORT"),
				username: config.getOrThrow<string>("POSTGRES_USER"),
				password: config.getOrThrow<string>("POSTGRES_PASSWORD"),
				database: config.getOrThrow<string>("POSTGRES_DB"),
				entities: [],
				migrations: [],
				synchronize: config.getOrThrow<string>("NODE_ENV") === "development",
			}),
			inject: [ConfigService],
		}),
		GrpcModule,
		JobsModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
