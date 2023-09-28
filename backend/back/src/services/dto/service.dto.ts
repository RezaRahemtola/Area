import { ApiProperty } from "@nestjs/swagger";
import { IsDataURI, IsString } from "class-validator";

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

	@ApiProperty({
		description: "The scopes of the service",
	})
	@IsString({ each: true })
	scopes!: string[];
}
