import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

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
				username: config.getOrThrow<string>("DB_USERNAME"),
				password: config.getOrThrow<string>("DB_PASSWORD"),
				database: config.getOrThrow<string>("DB_DATABASE"),
				entities: [],
				migrations: [],
				synchronize: config.get<string>("NODE_ENV") === "development",
			}),
			inject: [ConfigService],
		}),
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
