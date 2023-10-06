import { IsNotEmptyObject, IsOptional, IsString, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import WorkflowReactionDto, { WorkflowActionDto } from "./workflow-reaction.dto";

export default class UpdateWorkflowDto {
	@IsString()
	@IsOptional()
	name?: string;

	@Type(() => WorkflowActionDto)
	@ValidateNested()
	@IsNotEmptyObject({ nullable: false })
	@IsOptional()
	action?: WorkflowActionDto;

	@Type(() => WorkflowReactionDto)
	@ValidateNested({ each: true })
	@IsNotEmptyObject({ nullable: false }, { each: true })
	@IsOptional()
	reactions?: WorkflowReactionDto[];
}
