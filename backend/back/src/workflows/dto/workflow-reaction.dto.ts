import { IsNotEmpty, IsNotEmptyObject, IsUUID } from "class-validator";

export class WorkflowActionDto {
	@IsUUID(4)
	id!: string;

	@IsNotEmptyObject()
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	parameters!: Record<string, any>;

	@IsNotEmpty()
	areaId!: string;

	@IsNotEmpty()
	areaServiceId!: string;
}

export default class WorkflowReactionDto extends WorkflowActionDto {
	@IsUUID(4)
	previousAreaId!: string;
}
