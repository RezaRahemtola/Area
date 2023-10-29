import { IsBoolean, IsUUID } from "class-validator";
import { ApiProperty, IntersectionType } from "@nestjs/swagger";

export default class BulkWorkflowsDto {
	@ApiProperty()
	@IsUUID(4, { each: true })
	workflows!: string[];
}

export class ToggleWorkflowDto {
	@ApiProperty()
	@IsBoolean()
	newState!: boolean;
}

export class BulkToggleWorkflowsDto extends IntersectionType(BulkWorkflowsDto, ToggleWorkflowDto) {}
