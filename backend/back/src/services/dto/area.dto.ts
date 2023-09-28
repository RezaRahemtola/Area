import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class AreaDto {
	@ApiProperty({
		description: "The id of the area",
	})
	@IsString()
	id!: string;

	@ApiProperty({
		description: "The service scopes need by the area to work",
	})
	@IsString({ each: true })
	serviceScopesNeeded!: string[];
}
