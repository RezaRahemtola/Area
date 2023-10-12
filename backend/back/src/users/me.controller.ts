import { Body, Controller, Get, HttpStatus, Patch, Req, Res, UseGuards } from "@nestjs/common";
import { UsersService } from "./users.service";
import { ApiBearerAuth, ApiProduces, ApiTags, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { APIRequest } from "../types/request";
import { UpdateUserDto } from "./dto/update-user.dto";
import { Response } from "express";

@ApiBearerAuth()
@ApiTags("Self user")
@ApiProduces("application/json")
@ApiUnauthorizedResponse({
	description: "The user access token was either invalid or expired",
})
@UseGuards(JwtAuthGuard)
@Controller("me")
export class MeController {
	constructor(private readonly usersService: UsersService) {}

	@Get()
	async getSelfUser(@Req() { user: { id: userID } }: APIRequest) {
		const {
			id,
			isAdmin,
			email,
			createdAt,
			settings: { language, theme },
		} = await this.usersService.getUser({ id: userID });
		return {
			id,
			isAdmin,
			email,
			createdAt,
			settings: {
				language,
				theme,
			},
		};
	}

	@Patch()
	async updateSelfUser(
		@Req()
		{ user: { id } }: APIRequest,
		@Body()
		updateUserDto: UpdateUserDto,
		@Res()
		response: Response,
	) {
		const result = await this.usersService.updateUser({ id }, updateUserDto);
		return response.status(result ? HttpStatus.OK : HttpStatus.NOT_MODIFIED).send();
	}
}
