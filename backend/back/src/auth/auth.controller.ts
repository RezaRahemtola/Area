import { Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import CredentialsDto from "./dto/credentials.dto";

@Controller("auth")
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post("login")
	async logIn({ mail, password }: CredentialsDto) {
		return this.authService.logIn(mail, password);
	}

	@Post("register")
	async register({ mail, password }: CredentialsDto) {
		return this.authService.register(mail, password);
	}
}
