import { Module } from "@nestjs/common";
import { AboutService } from "./about.service";
import { AboutController } from "./about.controller";
import { ServicesModule } from "../services/services.module";

@Module({
	imports: [ServicesModule],
	controllers: [AboutController],
	providers: [AboutService],
})
export class AboutModule {}
