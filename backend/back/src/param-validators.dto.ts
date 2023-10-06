import { IsUUID } from "class-validator";

export class UuidParamDto {
	@IsUUID(4, { message: "Invalid UUID in path parameters" })
	uuid!: string;
}
