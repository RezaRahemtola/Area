import {
	Body,
	ConflictException,
	Controller,
	Delete,
	ForbiddenException,
	Get,
	InternalServerErrorException,
	Logger,
	NotFoundException,
	Param,
	Post,
	Req,
	UseGuards,
} from "@nestjs/common";
import { ConnectionsService } from "./connections.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { APIRequest } from "../types/request";
import {
	ApiBearerAuth,
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiParam,
	ApiProduces,
	ApiTags,
	ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import ConnectDto from "./dto/oauth.dto";
import { OauthService } from "./oauth.service";
import { ServiceIdParamDto } from "../param-validators.dto";
import { ServicesService } from "src/services/services.service";

@ApiTags("OAuth Connections")
@ApiProduces("application/json")
@ApiUnauthorizedResponse({
	description: "The user access token was either invalid or expired",
})
@Controller("connections")
export class ConnectionsController {
	private readonly logger = new Logger(ConnectionsController.name);

	constructor(
		private readonly connectionsService: ConnectionsService,
		private readonly oauthService: OauthService,
		private readonly servicesService: ServicesService,
	) {}

	@ApiBearerAuth()
	@ApiOkResponse({
		description: "Returns the available connections for the current user",
		type: [String],
	})
	@UseGuards(JwtAuthGuard)
	@Get("/available")
	async getAvailableConnections(
		@Req()
		{ user: { id: userId } }: APIRequest,
	): ReturnType<ConnectionsService["getAvailableConnections"]> {
		return this.connectionsService.getAvailableConnections(userId);
	}

	@ApiBearerAuth()
	@ApiOkResponse({
		description: "The link to connect to the service",
	})
	@ApiParam({
		description: "The service of the user connection to create",
		name: "serviceId",
	})
	@UseGuards(JwtAuthGuard)
	@Post("/:serviceId/connect")
	async connect(
		@Req()
		{ user: { id: userId } }: APIRequest,
		@Param()
		{ serviceId }: ServiceIdParamDto,
		@Body()
		{ scopes }: ConnectDto,
	) {
		if (!(await this.servicesService.getService(serviceId)).needConnection)
			throw new ForbiddenException("This service does not need a connection");
		this.logger.log(`Connecting user ${userId} to service ${serviceId} with scopes: ${scopes.join(", ")}`);
		const missingScopes = await this.connectionsService.getNewScopesForConnection(userId, serviceId, scopes);
		if (!missingScopes) {
			this.logger.warn(`User ${userId} already has a connection that satisfies these scopes`);
			throw new ConflictException("You already have a connection that satisfies these scopes");
		} else {
			this.logger.log(
				`User ${userId} new scopes for ${serviceId} are: ${
					missingScopes.length > 0 ? missingScopes.join(", ") : "no scope provided"
				}`,
			);
			this.logger.log(`Creating and sending an url for user ${userId} to connect to service ${serviceId}`);
			return {
				oauthUrl: await this.oauthService.getOAuthUrlForServiceUserAndScopes(userId, serviceId, missingScopes),
			};
		}
	}

	@ApiOkResponse({
		description: "The link to authenticate with the service",
	})
	@ApiParam({
		description: "The service to authenticate with",
		name: "serviceId",
	})
	@Get("/:serviceId/authenticate")
	async authenticate(
		@Param()
		{ serviceId }: ServiceIdParamDto,
	) {
		const service = this.oauthService.SERVICE_OAUTH_FACTORIES[serviceId];
		if (!service) throw new NotFoundException("This service does not exist");
		const loginScopes = service.loginScopes ?? ["email"];
		if (loginScopes.length === 0 || !service.getEmailForConnectionData)
			throw new ForbiddenException("You cannot authenticate with this service");
		this.logger.log(`Creating and sending an authentication url to connect to service ${serviceId}`);
		return {
			oauthUrl: await this.oauthService.getOAuthUrlForServiceUserAndScopes("authenticate", serviceId, loginScopes),
		};
	}

	@ApiBearerAuth()
	@ApiOkResponse({
		description: "The user connection was successfully deleted",
	})
	@ApiNotFoundResponse({
		description: "The user is not connected to this service",
	})
	@ApiParam({
		description: "The service of the user connection to delete",
		name: "serviceId",
	})
	@UseGuards(JwtAuthGuard)
	@Delete("/:serviceId")
	async deleteUserConnection(@Req() { user: { id: userId } }: APIRequest, @Param() { serviceId }: ServiceIdParamDto) {
		if (!(await this.connectionsService.deleteUserConnection(userId, serviceId)))
			throw new InternalServerErrorException("An unknown error occurred while deleting the connection");
		this.logger.log(`User ${userId} successfully deleted their connection to service ${serviceId}`);
	}
}
