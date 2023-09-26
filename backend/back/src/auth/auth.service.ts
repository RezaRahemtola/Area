import { ConflictException, Injectable, UnauthorizedException } from "@nestjs/common";
import { UserService } from "../user/user.service";
import { hash, verify as verifyArgonHash } from "argon2";
import { JwtService } from "@nestjs/jwt";
import LoginResultDto from "./dto/login-result.dto";
import { JwtPayload } from "../types/jwt";

@Injectable()
export class AuthService {
	constructor(
		private readonly jwtService: JwtService,
		private readonly userService: UserService,
	) {}

	async logIn(email: string, password: string): Promise<LoginResultDto> {
		const user = await this.userService.getUser({ email });
		if (!user || !(await verifyArgonHash(user.passwordHash, password)))
			throw new UnauthorizedException("Invalid credentials.");
		return {
			accessToken: this.jwtService.sign({ id: user.id }),
		};
	}

	async register(email: string, password: string): Promise<LoginResultDto> {
		const isUserCreated = await this.userService.createUser(email, await hash(password));
		if (!isUserCreated) throw new ConflictException("An user already exists with this email.");
		const { id } = await this.userService.getUser({ email });
		return {
			accessToken: this.jwtService.sign({ id }),
		};
	}

	async verifyToken(token: string): Promise<JwtPayload | null> {
		try {
			return this.jwtService.verify(token);
		} catch {
			return null;
		}
	}
}
