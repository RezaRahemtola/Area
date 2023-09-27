import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import CredentialsDto from "./dto/credentials.dto";

@Controller("auth")
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post("login")
	async logIn(@Body() { email, password }: CredentialsDto) {
		return this.authService.logIn(email, password);
	}

	@Post("register")
	async register(@Body() { email, password }: CredentialsDto) {
		return this.authService.register(email, password);
	}
}
