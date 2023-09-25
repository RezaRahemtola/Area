import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { UserModule } from "../user/user.module";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";

@Module({
	imports: [
		JwtModule.registerAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (config: ConfigService) => ({
				secret: config.getOrThrow<string>("JWT_SECRET"),
				signOptions: {
					expiresIn: config.getOrThrow<string>("JWT_EXPIRE_DELAY"),
				},
			}),
		}),
		UserModule,
	],
	controllers: [AuthController],
	providers: [AuthService],
})
export class AuthModule {}
