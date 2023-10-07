import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginCredentialsDto, RegisterCredentialsDto } from "./dto/credentials.dto";

@Controller("auth")
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post("login")
	async logIn(@Body() { email, password }: LoginCredentialsDto) {
		return this.authService.logIn(email, password);
	}

	@Post("register")
	async register(@Body() { email, password }: RegisterCredentialsDto) {
		return this.authService.register(email, password);
	}
}
