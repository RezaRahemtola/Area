import { IsBoolean, IsNotEmpty, IsNotEmptyObject, IsOptional, ValidateNested } from "class-validator";
import WorkflowReactionDto, { WorkflowActionDto } from "./workflow-reaction.dto";
import { Type } from "class-transformer";

export default class CreateWorkflowDto {
	@IsNotEmpty()
	name!: string;

	@Type(() => WorkflowActionDto)
	@ValidateNested()
	@IsNotEmptyObject({ nullable: false })
	entry!: WorkflowActionDto;

	@Type(() => WorkflowReactionDto)
	@ValidateNested({ each: true })
	@IsNotEmptyObject({ nullable: false }, { each: true })
	steps!: WorkflowReactionDto[];

	@IsBoolean()
	@IsOptional()
	active?: boolean;
}
