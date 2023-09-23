import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsStrongPassword } from "class-validator";

export default class LoginCredentialsDto {
	@ApiProperty()
	@IsEmail()
	mail!: string;

	@ApiProperty()
	@IsStrongPassword({ minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 })
	password!: string;
}
