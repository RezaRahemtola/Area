import { forwardRef, Module } from "@nestjs/common";
import { ConnectionsService } from "./connections.service";
import { ConnectionsController } from "./connections.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import UserConnection from "./entities/user-connection.entity";
import ServiceScope from "../services/entities/service-scope.entity";
import { ServicesModule } from "../services/services.module";
import { HttpModule } from "@nestjs/axios";
import { OauthController } from "./oauth.controller";
import { OauthService } from "./oauth.service";
import { UsersModule } from "../users/users.module";
import { AuthModule } from "../auth/auth.module";
import { GrpcModule } from "../grpc/grpc.module";

@Module({
	imports: [
		TypeOrmModule.forFeature([UserConnection, ServiceScope]),
		forwardRef(() => ServicesModule),
		HttpModule,
		UsersModule,
		forwardRef(() => GrpcModule),
		forwardRef(() => AuthModule),
	],
	controllers: [ConnectionsController, OauthController],
	providers: [ConnectionsService, OauthService],
	exports: [ConnectionsService, OauthService],
})
export class ConnectionsModule {}
