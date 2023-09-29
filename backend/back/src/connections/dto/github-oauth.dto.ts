import { IsString } from "class-validator";
import OauthDto from "./oauth.dto";
import { ApiProperty } from "@nestjs/swagger";

export default class GithubOAuthDto extends OauthDto {
	@ApiProperty({ description: "The GitHub OAuth code" })
	@IsString()
	code!: string;
}
