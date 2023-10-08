import {
	Body,
	ConflictException,
	Controller,
	Delete,
	Get,
	InternalServerErrorException,
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

@ApiBearerAuth()
@ApiTags("OAuth Connections")
@ApiProduces("application/json")
@ApiUnauthorizedResponse({
	description: "The user access token was either invalid or expired",
})
@UseGuards(JwtAuthGuard)
@Controller("connections")
export class ConnectionsController {
	constructor(
		private readonly connectionsService: ConnectionsService,
		private readonly oauthService: OauthService,
	) {}

	@ApiOkResponse({
		description: "Returns the available connections for the current user",
		type: [String],
	})
	@Get("/available")
	async getAvailableConnections(
		@Req()
		{ user: { id: userId } }: APIRequest,
	): ReturnType<ConnectionsService["getAvailableConnections"]> {
		return this.connectionsService.getAvailableConnections(userId);
	}

	@Post("/:serviceId/connect")
	async connect(
		@Req()
		{ user: { id: userId } }: APIRequest,
		@Param("serviceId")
		serviceId: string,
		@Body()
		{ scopes }: ConnectDto,
	) {
		scopes = [...new Set(scopes)];
		const missingScopes = await this.connectionsService.getNewScopesForConnection(userId, serviceId, scopes);
		if (missingScopes.length === 0)
			throw new ConflictException("You already have a connection that satisfies these scopes");
		else
			return {
				oauthUrl: await this.oauthService.getOAuthUrlForServiceUserAndScopes(userId, serviceId, missingScopes),
			};
	}

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
	@Delete("/:serviceId")
	async deleteUserConnection(@Req() { user: { id: userId } }: APIRequest, @Param("serviceId") serviceId: string) {
		if (!(await this.connectionsService.deleteUserConnection(userId, serviceId)))
			throw new InternalServerErrorException("An unknown error occurred while deleting the connection");
	}
}
