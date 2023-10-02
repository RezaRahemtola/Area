import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";

@Module({
	imports: [TypeOrmModule.forFeature([User])],
	controllers: [],
	providers: [UsersService],
	exports: [UsersService],
})
export class UsersModule {}
