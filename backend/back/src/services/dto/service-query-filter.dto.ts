import { IsBooleanString, IsEnum, IsOptional } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";

export const SERVICE_HAS_FILTER = ["actions", "reactions"] as const;
export type ServiceHasFilter = (typeof SERVICE_HAS_FILTER)[number];

export default class ServiceQueryFilterDto {
	@ApiPropertyOptional({
		description: "Filter services by whether they have actions and/or reactions",
	})
	@IsOptional()
	@IsEnum(SERVICE_HAS_FILTER)
	has?: ServiceHasFilter;

	@ApiPropertyOptional({
		description: "Filter services by whether they can be used to authenticate users or not",
	})
	@IsOptional()
	@IsBooleanString()
	isAuthenticator?: string;

	@ApiPropertyOptional({
		description: "Filter services by whether they need a connection to work or not",
	})
	@IsOptional()
	@IsBooleanString()
	needConnection?: string;
}
