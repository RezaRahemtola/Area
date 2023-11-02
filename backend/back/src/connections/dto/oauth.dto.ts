import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, isUUID, Validate } from "class-validator";
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
		description: "The user identifier or 'authentification' to connect (stored in oauth state)",
	})
	@IsString()
	@IsNotEmpty()
	@Validate((value: unknown) => isUUID(value) || value === "authentification")
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

	@ApiPropertyOptional({
		description: "The Miro's team identifier",
		type: String,
	})
	@IsOptional()
	@IsString()
	team_id!: string;

	@ApiPropertyOptional({
		description: "The OAuth client identifier",
		type: String,
	})
	@IsOptional()
	@IsString()
	client_id!: string;

	@ApiPropertyOptional({
		description: "The Google user auth state",
	})
	@IsOptional()
	@IsNumber()
	authuser!: number;

	@ApiPropertyOptional({
		description: "The Google prompt state",
	})
	@IsOptional()
	@IsString()
	@IsNotEmpty()
	prompt!: string;

	@ApiPropertyOptional({
		description: "The code challenge sent to the OAuth provider",
	})
	@IsOptional()
	@IsString()
	@IsNotEmpty()
	code_challenge!: string;

	@ApiPropertyOptional({
		description: "The code challenge method sent to the OAuth provider",
	})
	@IsOptional()
	@IsString()
	@IsNotEmpty()
	code_challenge_method!: string;
}
