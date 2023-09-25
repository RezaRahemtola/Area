import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsStrongPassword } from "class-validator";

export default class CredentialsDto {
	@ApiProperty({
		description: "The email of the user",
	})
	@IsEmail()
	mail!: string;

	@ApiProperty({
		description: "The password of the user",
	})
	@IsStrongPassword({ minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 })
	password!: string;
}
