import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginCredentialsDto, RegisterCredentialsDto } from "./dto/credentials.dto";
import { ApiOkResponse, ApiTags } from "@nestjs/swagger";
import LoginResultDto from "./dto/login-result.dto";

@ApiTags("Authentication")
@Controller("auth")
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@ApiOkResponse({
		description: "The user was successfully logged in",
		type: LoginResultDto,
	})
	@Post("login")
	async logIn(@Body() { email, password }: LoginCredentialsDto) {
		return this.authService.logIn(email, password);
	}

	@ApiOkResponse({
		description: "The user was successfully created",
		type: LoginResultDto,
	})
	@Post("register")
	async register(@Body() { email, password }: RegisterCredentialsDto) {
		return this.authService.register(email, password);
	}
}
