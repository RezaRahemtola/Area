import { IsNotEmpty, IsNotEmptyObject, IsUUID } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { ServiceName } from "../../services/services.service";

export class WorkflowActionDto {
	@ApiProperty()
	@IsUUID(4)
	id!: string;

	@ApiProperty()
	@IsNotEmptyObject()
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	parameters!: Record<string, any>;

	@ApiProperty()
	@IsNotEmpty()
	areaId!: string;

	@ApiProperty()
	@IsNotEmpty()
	areaServiceId!: ServiceName;
}

export default class WorkflowReactionDto extends WorkflowActionDto {
	@ApiProperty()
	@IsUUID(4)
	previousAreaId!: string;
}
