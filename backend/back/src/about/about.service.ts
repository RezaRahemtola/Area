import { Injectable } from "@nestjs/common";
import { ServicesService } from "../services/services.service";
import AboutServiceDto from "./dto/about-service.dto";

@Injectable()
export class AboutService {
	constructor(private readonly servicesService: ServicesService) {}

	async getServices(): Promise<AboutServiceDto[]> {
		return Promise.all(
			(await this.servicesService.getServices(false)).map(async ({ id }) => ({
				name: id,
				actions: (await this.servicesService.getAREAsForService(id, true)).map(({ id, description }) => ({
					name: id,
					description,
				})),
				reactions: (await this.servicesService.getAREAsForService(id, false)).map(({ id, description }) => ({
					name: id,
					description,
				})),
			})),
		);
	}

	getCurrentTimestamp(): number {
		return Math.round(Date.now() / 1000);
	}
}
