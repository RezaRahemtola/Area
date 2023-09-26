import { IsBoolean, IsEmail, IsOptional, IsString } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class UpdateUserDto {
	@ApiPropertyOptional({ description: "The email of the user" })
	@IsOptional()
	@IsEmail()
	email?: string;

	@ApiPropertyOptional({ description: "The admin state of the user" })
	@IsOptional()
	@IsBoolean()
	isAdmin?: boolean;

	@ApiPropertyOptional({ description: "The TOTP secret of the user" })
	@IsOptional()
	@IsString()
	totpSecret?: string;
}
