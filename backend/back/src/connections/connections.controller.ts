import { Controller, Delete, Get, InternalServerErrorException, Param, Req, UseGuards } from "@nestjs/common";
import { ConnectionsService } from "./connections.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { APIRequest } from "../types/request";
import {
	ApiBearerAuth,
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiProduces,
	ApiTags,
	ApiUnauthorizedResponse,
} from "@nestjs/swagger";

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
	@Delete("/:serviceId")
	async deleteUserConnection(@Req() { user: { id: userId } }: APIRequest, @Param("serviceId") serviceId: string) {
		if (!(await this.connectionsService.deleteUserConnection(userId, serviceId)))
			throw new InternalServerErrorException("An unknown error occurred while deleting the connection");
	}
}
