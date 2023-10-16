import { Controller, Get, InternalServerErrorException, Param, Query, Res } from "@nestjs/common";
import { OauthService } from "./oauth.service";
import { OauthCallbackDto } from "./dto/oauth.dto";
import { Response } from "express";
import { ConfigService } from "@nestjs/config";
import { ApiTags } from "@nestjs/swagger";
import { ServiceIdParamDto } from "../param-validators.dto";

@ApiTags("OAuth Callbacks")
@Controller("connections/oauth")
export class OauthController {
	constructor(
		private readonly oauthService: OauthService,
		private readonly configService: ConfigService,
	) {}

	@Get("/:serviceId/callback")
	async callback(
		@Query()
		{ code, state: userId }: OauthCallbackDto,
		@Param()
		{ serviceId }: ServiceIdParamDto,
		@Res()
		response: Response,
	) {
		const connection = await this.oauthService.SERVICE_OAUTH_FACTORIES[serviceId].connectionFactory(userId, code);
		if (!connection) throw new InternalServerErrorException("Failed to create connection");
		return response.redirect(this.configService.getOrThrow<string>("FRONT_OAUTH_REDIRECTION_URL"));
	}
}
