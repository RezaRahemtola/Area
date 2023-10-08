import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsDataURI, IsOptional, IsString } from "class-validator";

export default class ServiceDto {
	@ApiProperty({
		description: "The id of the service",
	})
	@IsString()
	id!: string;

	@ApiProperty({
		description: "The image url of the service",
	})
	@IsDataURI()
	imageUrl!: string;

	@ApiPropertyOptional({
		description: "The scopes of the service",
	})
	@IsString({ each: true })
	@IsOptional()
	scopes?: string[];
}
