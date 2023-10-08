import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsStrongPassword } from "class-validator";

class CredentialsDto {
	@ApiProperty({
		description: "The email of the user",
	})
	@IsEmail()
	email!: string;
}

export class RegisterCredentialsDto extends CredentialsDto {
	@ApiProperty({
		description: "The password of the user",
	})
	@IsStrongPassword({ minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 })
	password!: string;
}

export class LoginCredentialsDto extends CredentialsDto {
	@ApiProperty({
		description: "The password of the user",
	})
	@IsNotEmpty()
	password!: string;
}
