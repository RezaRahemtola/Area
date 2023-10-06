import { IsBoolean, IsUUID } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export default class BulkWorkflowsDto {
	@ApiProperty()
	@IsUUID(4, { each: true })
	workflows!: string[];
}

export class BulkToggleWorkflowsDto extends BulkWorkflowsDto {
	@ApiProperty()
	@IsBoolean()
	newState!: boolean;
}
