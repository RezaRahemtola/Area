import { Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import LoginCredentialsDto from "./dto/login-credentials.dto";

@Controller("auth")
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post("login")
	async logIn({ mail, password }: LoginCredentialsDto) {
		return this.authService.logIn(mail, password);
	}

	@Post("register")
	async register({ mail, password }: LoginCredentialsDto) {
		return this.authService.register(mail, password);
	}
}
