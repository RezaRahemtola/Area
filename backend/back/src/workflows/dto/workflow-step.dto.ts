import { IsNotEmpty, IsNotEmptyObject, IsUUID } from "class-validator";

export class WorkflowEntryDto {
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

export default class WorkflowStepDto extends WorkflowEntryDto {
	@IsUUID(4)
	previousStepId!: string;
}
