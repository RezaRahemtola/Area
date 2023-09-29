import { IsArray, IsString } from "class-validator";
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
