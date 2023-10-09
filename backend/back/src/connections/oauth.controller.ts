import { Controller, Get, InternalServerErrorException, Query, Res } from "@nestjs/common";
import { OauthService } from "./oauth.service";
import { GoogleOauthCallbackDto, OauthCallbackDto } from "./dto/oauth.dto";
import { Response } from "express";
import { ConfigService } from "@nestjs/config";

@Controller("connections/oauth")
export class OauthController {
	constructor(
		private readonly oauthService: OauthService,
		private readonly configService: ConfigService,
	) {}

	@Get("/github/callback")
	async githubCallback(@Query() { code, state: userId }: OauthCallbackDto, @Res() response: Response) {
		const connection = await this.oauthService.createGitHubConnection(userId, code);
		if (!connection) throw new InternalServerErrorException("Failed to create connection");
		return response.redirect(this.configService.getOrThrow<string>("FRONT_BASE_URL"));
	}

	@Get("/google/callback")
	async googleCallback(@Query() { code, state: userId }: GoogleOauthCallbackDto, @Res() response: Response) {
		const connection = await this.oauthService.createGoogleConnection(userId, code);
		if (!connection) throw new InternalServerErrorException("Failed to create connection");
		return response.redirect(this.configService.getOrThrow<string>("FRONT_BASE_URL"));
	}
}
