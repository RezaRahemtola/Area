import { IsArray, IsOptional, IsString, IsUUID } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

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
		description: "The user identifier to connect (stored in oauth state)",
	})
	@IsUUID(4)
	state!: string;

	@ApiPropertyOptional({
		description: "The OAuth scopes validated by the user",
		type: String,
	})
	@IsOptional()
	@IsString()
	scope!: string;

	@ApiPropertyOptional({
		description: "The OAuth granted scopes",
		type: String,
	})
	@IsOptional()
	@IsString()
	granted_scopes!: string;

	@ApiPropertyOptional({
		description: "The OAuth denied scopes",
		type: String,
	})
	@IsOptional()
	@IsString()
	denied_scopes!: string;

	@ApiPropertyOptional({
		description: "The opaque session state of the user",
		type: String,
	})
	@IsOptional()
	@IsString()
	session_state!: string;
}
