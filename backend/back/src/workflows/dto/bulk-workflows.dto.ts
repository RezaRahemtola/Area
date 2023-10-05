import { IsBoolean, IsUUID } from "class-validator";

export default class BulkWorkflowsDto {
	@IsUUID(4, { each: true })
	workflows!: string[];
}

export class BulkToggleWorkflowsDto extends BulkWorkflowsDto {
	@IsBoolean()
	newState!: boolean;
}
