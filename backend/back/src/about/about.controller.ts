import { Controller, Get, Ip } from "@nestjs/common";
import { AboutService } from "./about.service";
import { ApiOkResponse, ApiProduces, ApiTags } from "@nestjs/swagger";

@ApiTags("About")
@ApiProduces("application/json")
@Controller()
export class AboutController {
	constructor(private readonly aboutService: AboutService) {}

	@ApiOkResponse({
		description:
			"Returns the manifest of the AREA application, as described in the subject. Containing, client host, server time and details about the services",
		schema: {
			properties: {
				client: {
					properties: {
						host: { type: "string" },
					},
				},
				server: {
					properties: {
						current_time: { type: "number" },
						services: {
							type: "array",
							items: {
								properties: {
									name: { type: "string" },
									actions: {
										type: "array",
										items: {
											properties: {
												name: { type: "string" },
												description: { type: "string" },
											},
										},
									},
									reactions: {
										type: "array",
										items: {
											properties: {
												name: { type: "string" },
												description: { type: "string" },
											},
										},
									},
								},
							},
						},
					},
				},
			},
		},
	})
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
