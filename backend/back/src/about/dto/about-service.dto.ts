import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsEnum, IsNotEmptyObject, IsString } from "class-validator";
import { Type } from "class-transformer";
import { SERVICE_NAMES, ServiceName } from "../../services/services.service";

export class AboutAreaDto {
	@ApiProperty({
		description: "The name of the area",
		type: String,
	})
	@IsString()
	name!: string;

	@ApiProperty({
		description: "The description of the area",
		type: String,
	})
	description!: string;
}

export default class AboutServiceDto {
	@ApiProperty({
		description: "The name of the service",
		type: String,
	})
	@IsEnum(SERVICE_NAMES)
	name!: ServiceName;

	@ApiProperty({
		description: "The actions of the service",
		type: [AboutAreaDto],
	})
	@IsArray()
	@IsNotEmptyObject(undefined, { each: true })
	@Type(() => AboutAreaDto)
	actions!: AboutAreaDto[];

	@ApiProperty({
		description: "The reactions of the service",
		type: [AboutAreaDto],
	})
	@IsArray()
	@IsNotEmptyObject(undefined, { each: true })
	@Type(() => AboutAreaDto)
	reactions!: AboutAreaDto[];
}
