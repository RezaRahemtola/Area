import { ApiProperty } from "@nestjs/swagger";
import { IsNumber } from "class-validator";

export class WorkflowSummaryDto {
	@ApiProperty()
	@IsNumber()
	workflowRuns!: number;

	@ApiProperty()
	@IsNumber()
	workflowErrors!: number;

	@ApiProperty()
	@IsNumber()
	workflows!: number;

	@ApiProperty()
	@IsNumber()
	activeWorkflows!: number;
}
