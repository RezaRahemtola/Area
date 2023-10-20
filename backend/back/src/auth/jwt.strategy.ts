import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from "@nestjs/config";
import { JwtCustomPayload } from "../types/jwt";
import { UsersService } from "../users/users.service";

@Injectable()
export default class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(
		configService: ConfigService,
		private readonly usersService: UsersService,
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: configService.getOrThrow<string>("JWT_SECRET"),
		});
	}

	async validate(payload: JwtCustomPayload) {
		if (!("id" in payload)) throw new UnauthorizedException("Malformed token");
		await this.usersService.getUser({ id: payload.id }).catch(({ message }) => {
			throw new UnauthorizedException(message);
		});
		return payload;
	}
}
