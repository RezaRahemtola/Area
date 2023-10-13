import { IsEnum, IsUUID } from "class-validator";
import { SERVICE_NAMES, ServiceName } from "./services/services.service";

export class UuidParamDto {
	@IsUUID(4, { message: "Invalid UUID in path parameters" })
	uuid!: string;
}

export class ServiceIdParamDto {
	@IsEnum(SERVICE_NAMES)
	serviceId: ServiceName;
}
