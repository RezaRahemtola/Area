import { ConflictException, Injectable, UnauthorizedException } from "@nestjs/common";
import { UserService } from "../user/user.service";
import { verify as verifyArgonHash } from "argon2";
import { JwtService } from "@nestjs/jwt";
import LoginResultDto from "./dto/login-result.dto";

export type JwtBasePayload = { iat: number; exp?: number };
export type JwtCustomPayload = { id: string } & JwtBasePayload;

@Injectable()
export class AuthService {
	constructor(
		private readonly jwtService: JwtService,
		private readonly userService: UserService,
	) {}

	async logIn(mail: string, password: string): Promise<LoginResultDto> {
		const user = await this.userService.getUser({ mail });
		if (!user || !(await verifyArgonHash(user.passwordHash, password)))
			throw new UnauthorizedException("Invalid credentials.");
		return {
			accessToken: this.jwtService.sign({ id: user.id }),
		};
	}

	async register(mail: string, password: string): Promise<LoginResultDto> {
		const isUserCreated = await this.userService.createUser(mail, password);
		if (!isUserCreated) throw new ConflictException("An user already exists with this mail.");
		const { id } = await this.userService.getUser({ mail });
		return {
			accessToken: this.jwtService.sign({ id }),
		};
	}

	async verifyToken(token: string): Promise<JwtCustomPayload | null> {
		try {
			return this.jwtService.verify(token);
		} catch {
			return null;
		}
	}
}
