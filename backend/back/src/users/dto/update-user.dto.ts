import { IsBoolean, IsEmail, IsEnum, IsOptional, IsString } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { Language, LANGUAGES, Theme, THEMES } from "../../types/user-settings";

export class UpdateUserDto {
	@ApiPropertyOptional({ description: "The email of the user" })
	@IsOptional()
	@IsEmail()
	email?: string;

	@ApiPropertyOptional({ description: "The language of the user" })
	@IsOptional()
	@IsEnum(LANGUAGES)
	language?: Language;

	@ApiPropertyOptional({ description: "The theme of the user" })
	@IsOptional()
	@IsEnum(THEMES)
	theme?: Theme;
}

export class AdminUpdateUserDto extends UpdateUserDto {
	@ApiPropertyOptional({ description: "The admin state of the user" })
	@IsOptional()
	@IsBoolean()
	isAdmin?: boolean;

	@ApiPropertyOptional({ description: "The TOTP secret of the user" })
	@IsOptional()
	@IsString()
	totpSecret?: string;
}
