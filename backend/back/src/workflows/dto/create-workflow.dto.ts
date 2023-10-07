import { IsBoolean, IsNotEmpty, IsNotEmptyObject, IsOptional, ValidateNested } from "class-validator";
import WorkflowReactionDto, { WorkflowActionDto } from "./workflow-reaction.dto";
import { Type } from "class-transformer";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export default class CreateWorkflowDto {
	@ApiProperty()
	@IsNotEmpty()
	name!: string;

	@ApiProperty()
	@Type(() => WorkflowActionDto)
	@ValidateNested()
	@IsNotEmptyObject({ nullable: false })
	action!: WorkflowActionDto;

	@ApiProperty({
		type: [WorkflowReactionDto],
	})
	@Type(() => WorkflowReactionDto)
	@ValidateNested({ each: true })
	@IsNotEmptyObject({ nullable: false }, { each: true })
	reactions!: WorkflowReactionDto[];

	@ApiPropertyOptional()
	@IsBoolean()
	@IsOptional()
	active?: boolean;
}
