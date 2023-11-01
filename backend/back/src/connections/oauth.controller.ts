import {
	Controller,
	ForbiddenException,
	Get,
	InternalServerErrorException,
	Logger,
	Param,
	Query,
	Res,
} from "@nestjs/common";
import { OauthService } from "./oauth.service";
import { OauthCallbackDto } from "./dto/oauth.dto";
import { Response } from "express";
import { ConfigService } from "@nestjs/config";
import { ApiTags } from "@nestjs/swagger";
import { ServiceIdParamDto } from "../param-validators.dto";
import { ConnectionsService } from "./connections.service";
import { AuthService } from "../auth/auth.service";
import { UsersService } from "../users/users.service";

@ApiTags("OAuth Callbacks")
@Controller("connections/oauth")
export class OauthController {
	private readonly logger = new Logger(OauthController.name);

	constructor(
		private readonly oauthService: OauthService,
		private readonly configService: ConfigService,
		private readonly connectionService: ConnectionsService,
		private readonly authService: AuthService,
		private readonly usersService: UsersService,
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
		const { data, scopes } = await this.oauthService.SERVICE_OAUTH_FACTORIES[serviceId].connectionFactory(
			code,
			granted_scopes || scope,
		);
		const queryParams: URLSearchParams = new URLSearchParams();
		if (userId === "authenticate") {
			const emailGetter = this.oauthService.SERVICE_OAUTH_FACTORIES[serviceId].getEmailForConnectionData;
			if (!emailGetter) throw new ForbiddenException("You cannot authenticate with this service");
			const email = await emailGetter(data);
			if (!email) throw new InternalServerErrorException("Failed to get email from connection data");

			const user = await this.usersService.getUser({ email }).catch(() => null);
			let token: string;
			if (!user) {
				this.logger.log(`User ${email} does not exist, registering them...`);
				token = await this.authService.registerUserViaOauthForConnection(email, { data, scopes, serviceId });
			} else {
				this.logger.log(`User ${email} exists, logging them in...`);
				token = await this.authService.loginUserViaOauthForServiceId(email, serviceId);
			}
			queryParams.append("token", token);
		} else {
			const connection = await this.connectionService.createUserConnection(userId, serviceId, scopes, data);
			if (!connection) throw new InternalServerErrorException("Failed to create connection");
			this.logger.log(`Connection created for user ${userId}, redirecting to frontend...`);
		}
		return response.redirect(
			`${this.configService.getOrThrow<string>("FRONT_OAUTH_REDIRECTION_URL")}?${queryParams.toString()}`,
		);
	}
}
