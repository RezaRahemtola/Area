import { ConflictException, Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { hash, verify as verifyArgonHash } from "argon2";
import { JwtService } from "@nestjs/jwt";
import LoginResultDto from "./dto/login-result.dto";
import { JwtPayload } from "../types/jwt";

@Injectable()
export class AuthService {
	private readonly logger = new Logger(AuthService.name);

	constructor(
		private readonly jwtService: JwtService,
		private readonly usersService: UsersService,
	) {}

	async logIn(email: string, password: string): Promise<LoginResultDto> {
		try {
			const user = await this.usersService.getUser({ email });
			// noinspection ExceptionCaughtLocallyJS
			if (!(await verifyArgonHash(user.passwordHash, password))) throw new UnauthorizedException("Invalid password.");
			this.logger.log(`Logging in user ${email}`);
			return {
				accessToken: this.jwtService.sign({ id: user.id }),
			};
		} catch (error) {
			this.logger.warn(`Invalid credentials for user ${email}`);
			throw new UnauthorizedException("Invalid email/password");
		}
	}

	async register(email: string, password: string): Promise<LoginResultDto> {
		const isUserCreated = await this.usersService.createUser(email, await hash(password));
		if (!isUserCreated) throw new ConflictException("An user already exists with this email.");
		const { id } = await this.usersService.getUser({ email });
		this.logger.log(`Registered user ${email}, logging them in automatically`);
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
