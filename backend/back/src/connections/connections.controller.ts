import {
	Body,
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
	ApiBody,
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiParam,
	ApiProduces,
	ApiTags,
	ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import GithubOAuthDto from "./dto/github-oauth.dto";
import { UuidParamDto } from "../param-validators.dto";

@ApiBearerAuth()
@ApiTags("OAuth Connections")
@ApiProduces("application/json")
@ApiUnauthorizedResponse({
	description: "The user access token was either invalid or expired",
})
@UseGuards(JwtAuthGuard)
@Controller("connections")
export class ConnectionsController {
	constructor(private readonly connectionsService: ConnectionsService) {}

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

	@ApiOkResponse({
		description: "The user connection was successfully deleted",
	})
	@ApiNotFoundResponse({
		description: "The user is not connected to this service",
	})
	@ApiParam({
		description: "The UUID of the user connection to delete",
		name: "uuid",
	})
	@Delete("/:uuid")
	async deleteUserConnection(@Req() { user: { id: userId } }: APIRequest, @Param() { uuid: serviceId }: UuidParamDto) {
		if (!(await this.connectionsService.deleteUserConnection(userId, serviceId)))
			throw new InternalServerErrorException("An unknown error occurred while deleting the connection");
	}

	@ApiBody({ type: GithubOAuthDto })
	@Post("/github")
	async createGithubConnection(
		@Req()
		{ user: { id: userId } }: APIRequest,
		@Body() { code, scopes }: GithubOAuthDto,
	) {
		return this.connectionsService.createGitHubConnection(userId, scopes, code);
	}
}
