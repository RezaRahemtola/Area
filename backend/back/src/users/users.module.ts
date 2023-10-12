import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { MeController } from "./me.controller";
import UserSettings from "./entities/user-settings.entity";

@Module({
	imports: [TypeOrmModule.forFeature([User, UserSettings])],
	controllers: [MeController],
	providers: [UsersService],
	exports: [UsersService],
})
export class UsersModule {}
