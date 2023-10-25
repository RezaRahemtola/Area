import { Controller, Get, Ip } from "@nestjs/common";
import { AboutService } from "./about.service";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("About")
@Controller()
export class AboutController {
	constructor(private readonly aboutService: AboutService) {}

	@Get("/about.json")
	async getAbout(@Ip() ip: string) {
		return {
			client: {
				host: ip,
			},
			server: {
				current_time: this.aboutService.getCurrentTimestamp(),
				services: await this.aboutService.getServices(),
			},
		};
	}
}
