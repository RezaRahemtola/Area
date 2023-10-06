import { IsNotEmptyObject, IsOptional, IsString, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import WorkflowStepDto, { WorkflowEntryDto } from "./workflow-step.dto";

export default class UpdateWorkflowDto {
	@IsString()
	@IsOptional()
	name?: string;

	@Type(() => WorkflowEntryDto)
	@ValidateNested()
	@IsNotEmptyObject({ nullable: false })
	@IsOptional()
	action?: WorkflowEntryDto;

	@Type(() => WorkflowStepDto)
	@ValidateNested({ each: true })
	@IsNotEmptyObject({ nullable: false }, { each: true })
	@IsOptional()
	reactions?: WorkflowStepDto[];
}
