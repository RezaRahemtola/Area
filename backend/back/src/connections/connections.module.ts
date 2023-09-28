import { Module } from "@nestjs/common";
import { ConnectionsService } from "./connections.service";
import { ConnectionsController } from "./connections.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import UserConnection from "./entities/user-connection.entity";
import ServiceScope from "../services/entities/service-scope.entity";
import { ServicesModule } from "../services/services.module";

@Module({
	imports: [TypeOrmModule.forFeature([UserConnection, ServiceScope]), ServicesModule],
	controllers: [ConnectionsController],
	providers: [ConnectionsService],
})
export class ConnectionsModule {}
