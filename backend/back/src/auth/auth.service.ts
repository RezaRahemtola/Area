import {
	ConflictException,
	Injectable,
	InternalServerErrorException,
	Logger,
	UnauthorizedException,
} from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { hash, verify as verifyArgonHash } from "argon2";
import { JwtService } from "@nestjs/jwt";
import LoginResultDto from "./dto/login-result.dto";
import { JwtPayload } from "../types/jwt";
import { User } from "../users/entities/user.entity";
import { UserConnectionData } from "../connections/oauth.service";
import { ConnectionsService } from "../connections/connections.service";
import { ServiceName } from "../services/services.service";

@Injectable()
export class AuthService {
	private readonly logger = new Logger(AuthService.name);

	constructor(
		private readonly jwtService: JwtService,
		private readonly usersService: UsersService,
		private readonly connectionsService: ConnectionsService,
	) {}

	async logIn(email: string, password: string): Promise<LoginResultDto> {
		try {
			const user = await this.usersService.getUser({ email });
			if (!(await verifyArgonHash(user.passwordHash, password))) {
				// noinspection ExceptionCaughtLocallyJS
				throw new UnauthorizedException("Invalid password.");
			}
			this.logger.log(`Logging in user ${email}`);
			return {
				accessToken: this.generateTokenForUser(user),
			};
		} catch (error) {
			this.logger.warn(`Invalid credentials for user ${email}`);
			throw new UnauthorizedException("Invalid email/password");
		}
	}

	async register(email: string, password: string): Promise<LoginResultDto> {
		const isUserCreated = await this.usersService.createUser(email, await hash(password));
		if (!isUserCreated) throw new ConflictException("An user already exists with this email.");
		const user = await this.usersService.getUser({ email });
		this.logger.log(`Registered user ${email}, logging them in automatically`);
		return {
			accessToken: this.generateTokenForUser(user),
		};
	}

	async registerUserViaOauthForConnection(
		email: string,
		{
			scopes,
			data,
			serviceId,
		}: UserConnectionData & {
			serviceId: ServiceName;
		},
	): Promise<string> {
		if (await this.usersService.getUser({ email }).catch(() => null))
			throw new ConflictException("An user already exists with this email.");
		const [user, connection] = await this.connectionsService.createUserAndConnectionForData(
			email,
			serviceId,
			scopes,
			data,
		);
		if (!connection) throw new InternalServerErrorException("Failed to create connection");
		this.logger.log(`Created user ${user.id} identified by email ${email} and connection for service ${serviceId}`);
		return this.generateTokenForUser(user);
	}

	async loginUserViaOauthForServiceId(email: string, serviceId: ServiceName): Promise<string> {
		const user = await this.usersService.getUser({ email });
		if (!user) throw new UnauthorizedException("No users are registered with this email");
		if (user.passwordHash) throw new UnauthorizedException("This user has a password, they can't use OAuth");
		if (!(await this.connectionsService.getUserConnectionForService(user.id, serviceId)))
			throw new UnauthorizedException("No connection are registered for this user and service");
		this.logger.log(`Logging in user ${user.id} identified by email ${email} via service ${serviceId}`);
		return this.generateTokenForUser(user);
	}

	generateTokenForUser(user: User): string {
		return this.jwtService.sign({ id: user.id });
	}

	async verifyToken(token: string): Promise<JwtPayload | null> {
		try {
			return this.jwtService.verify(token);
		} catch {
			return null;
		}
	}
}
