import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { GrpcModule } from "./grpc/grpc.module";
import { UsersModule } from "./users/users.module";
import { AuthModule } from "./auth/auth.module";
import { JobsModule } from "./jobs/jobs.module";
import { ConnectionsModule } from "./connections/connections.module";
import { ServicesModule } from "./services/services.module";
import { WorkflowsModule } from "./workflows/workflows.module";
import { DATA_SOURCE_OPTIONS } from "./database";
import { AboutModule } from './about/about.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			envFilePath: [".env"],
			isGlobal: true,
		}),
		TypeOrmModule.forRoot(DATA_SOURCE_OPTIONS),
		AuthModule,
		ConnectionsModule,
		GrpcModule,
		JobsModule,
		UsersModule,
		ServicesModule,
		WorkflowsModule,
		AboutModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
