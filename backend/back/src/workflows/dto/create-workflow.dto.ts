import { IsBoolean, IsNotEmpty, IsNotEmptyObject, IsOptional, ValidateNested } from "class-validator";
import WorkflowStepDto, { WorkflowEntryDto } from "./workflow-step.dto";
import { Type } from "class-transformer";

export default class CreateWorkflowDto {
	@IsNotEmpty()
	name!: string;

	@Type(() => WorkflowEntryDto)
	@ValidateNested()
	@IsNotEmptyObject({ nullable: false })
	entry!: WorkflowEntryDto;

	@Type(() => WorkflowStepDto)
	@ValidateNested({ each: true })
	@IsNotEmptyObject({ nullable: false }, { each: true })
	steps!: WorkflowStepDto[];

	@IsBoolean()
	@IsOptional()
	active?: boolean;
}
