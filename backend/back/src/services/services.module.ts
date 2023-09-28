import { Module } from "@nestjs/common";
import { ServicesService } from "./services.service";
import { ServicesController } from "./services.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import ServiceScope from "./entities/service-scope.entity";
import Service from "./entities/service.entity";

@Module({
	imports: [TypeOrmModule.forFeature([Service, ServiceScope])],
	controllers: [ServicesController],
	providers: [ServicesService],
	exports: [ServicesService],
})
export class ServicesModule {}
