import { Controller, Get, InternalServerErrorException, Logger, Param, Query, Res } from "@nestjs/common";
import { OauthService } from "./oauth.service";
import { OauthCallbackDto } from "./dto/oauth.dto";
import { Response } from "express";
import { ConfigService } from "@nestjs/config";
import { ApiTags } from "@nestjs/swagger";
import { ServiceIdParamDto } from "../param-validators.dto";

@ApiTags("OAuth Callbacks")
@Controller("connections/oauth")
export class OauthController {
	private readonly logger = new Logger(OauthController.name);

	constructor(
		private readonly oauthService: OauthService,
		private readonly configService: ConfigService,
	) {}

	@Get("/:serviceId/callback")
	async callback(
		@Query()
		{ code, state: userId, granted_scopes, scope }: OauthCallbackDto,
		@Param()
		{ serviceId }: ServiceIdParamDto,
		@Res()
		response: Response,
	) {
		this.logger.log(`Received callback from ${serviceId} for user ${userId}`);
		const connection = await this.oauthService.SERVICE_OAUTH_FACTORIES[serviceId].connectionFactory(
			userId,
			code,
			granted_scopes || scope,
		);
		if (!connection) throw new InternalServerErrorException("Failed to create connection");
		this.logger.log(`Connection created for user ${userId}, redirecting to frontend...`);
		return response.redirect(this.configService.getOrThrow<string>("FRONT_OAUTH_REDIRECTION_URL"));
	}
}
