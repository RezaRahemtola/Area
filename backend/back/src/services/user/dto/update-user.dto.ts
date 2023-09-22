import { IsBoolean, IsEmail, IsOptional, IsString } from "class-validator";

export class UpdateUserDto {
	@IsOptional()
	@IsEmail()
	mail?: string;

	@IsOptional()
	@IsBoolean()
	isAdmin?: boolean;

	@IsOptional()
	@IsString()
	totpSecret?: string;
}
