import { IsArray, IsString, IsUUID } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export default class OauthDto {
	@ApiProperty({
		description: "The OAuth scopes validated by the user",
		type: [String],
	})
	@IsArray()
	@IsString({ each: true })
	scopes!: string[];
}

export class OauthCallbackDto {
	@ApiProperty({
		description: "The OAuth authorization code",
		type: String,
	})
	@IsString()
	code!: string;

	@ApiProperty({
		description: "The user identifier to connect",
	})
	@IsUUID(4)
	userId!: string;
}
