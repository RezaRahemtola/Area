import { IsNotEmptyObject, IsOptional, IsString, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import WorkflowReactionDto, { WorkflowActionDto } from "./workflow-reaction.dto";
import { ApiPropertyOptional } from "@nestjs/swagger";

export default class UpdateWorkflowDto {
	@ApiPropertyOptional()
	@IsString()
	@IsOptional()
	name?: string;

	@ApiPropertyOptional({
		type: WorkflowActionDto,
	})
	@Type(() => WorkflowActionDto)
	@ValidateNested()
	@IsNotEmptyObject({ nullable: false })
	@IsOptional()
	action?: WorkflowActionDto;

	@ApiPropertyOptional({
		type: [WorkflowReactionDto],
	})
	@Type(() => WorkflowReactionDto)
	@ValidateNested({ each: true })
	@IsNotEmptyObject({ nullable: false }, { each: true })
	@IsOptional()
	reactions?: WorkflowReactionDto[];
}
