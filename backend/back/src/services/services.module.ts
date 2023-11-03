import { forwardRef, Module } from "@nestjs/common";
import { ServicesService } from "./services.service";
import { ServicesController } from "./services.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import ServiceScope from "./entities/service-scope.entity";
import Service from "./entities/service.entity";
import Area from "./entities/area.entity";
import { ConnectionsModule } from "../connections/connections.module";

@Module({
	imports: [TypeOrmModule.forFeature([Service, ServiceScope, Area]), forwardRef(() => ConnectionsModule)],
	controllers: [ServicesController],
	providers: [ServicesService],
	exports: [ServicesService],
})
export class ServicesModule {}
