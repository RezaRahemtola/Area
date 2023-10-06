import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";
import { GrpcModule } from "./grpc/grpc.module";
import { User } from "./users/entities/user.entity";
import { UsersModule } from "./users/users.module";
import { AuthModule } from "./auth/auth.module";
import { JobsModule } from "./jobs/jobs.module";
import { ConnectionsModule } from "./connections/connections.module";
import { ServicesModule } from "./services/services.module";
import { WorkflowsModule } from "./workflows/workflows.module";
import Service from "./services/entities/service.entity";
import ServiceScope from "./services/entities/service-scope.entity";
import UserConnection from "./connections/entities/user-connection.entity";
import Area from "./services/entities/area.entity";
import Workflow from "./workflows/entities/workflow.entity";
import WorkflowArea from "./workflows/entities/workflow-area.entity";

@Module({
	imports: [
		ConfigModule.forRoot({
			envFilePath: [".env"],
			isGlobal: true,
		}),
		TypeOrmModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: (config: ConfigService) => ({
				type: "postgres",
				namingStrategy: new SnakeNamingStrategy(),
				host: config.getOrThrow<string>("DB_HOST"),
				port: config.getOrThrow<number>("DB_PORT"),
				username: config.getOrThrow<string>("POSTGRES_USER"),
				password: config.getOrThrow<string>("POSTGRES_PASSWORD"),
				database: config.getOrThrow<string>("POSTGRES_DB"),
				entities: [User, Service, ServiceScope, UserConnection, Area, Workflow, WorkflowArea],
				migrations: [],
				synchronize: config.getOrThrow<string>("NODE_ENV") === "development",
			}),
			inject: [ConfigService],
		}),
		GrpcModule,
		UsersModule,
		AuthModule,
		JobsModule,
		ConnectionsModule,
		ServicesModule,
		WorkflowsModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
