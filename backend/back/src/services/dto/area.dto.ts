import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsBoolean, IsEnum, IsString } from "class-validator";
import { Type } from "class-transformer";

export const PARAMETERS_FORM_FLOW_FIELD_TYPES = [
	"email",
	"short-text",
	"long-text",
	"integer",
	"float",
	"date",
	"datetime",
	"time",
] as const;

export class ParametersFormFlowFieldDto {
	@ApiProperty({
		description: "The name of the parameter",
	})
	@IsString()
	name!: string;

	@ApiProperty({
		description: "The type of the parameter",
		enum: PARAMETERS_FORM_FLOW_FIELD_TYPES,
	})
	@IsEnum(PARAMETERS_FORM_FLOW_FIELD_TYPES)
	type!: (typeof PARAMETERS_FORM_FLOW_FIELD_TYPES)[number];

	@ApiProperty({
		description: "Whether the parameter is required or not",
	})
	@IsBoolean()
	required!: boolean;
}

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

	@ApiProperty({
		description: "The parameters form flow for the area",
		type: [ParametersFormFlowFieldDto],
	})
	@IsArray()
	@Type(() => ParametersFormFlowFieldDto)
	parametersFormFlow!: ParametersFormFlowFieldDto[];

	@ApiProperty({
		description: "The description of the area",
	})
	@IsString()
	description!: string;
}
