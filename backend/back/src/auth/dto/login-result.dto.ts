import { ApiProperty } from "@nestjs/swagger";
import { IsJWT } from "class-validator";

export default class LoginResultDto {
	@ApiProperty({ description: "The JWT access token of the user, available for 1 day" })
	@IsJWT()
	accessToken!: string;
}
