import { Controller, Get, NotFoundException, Param } from "@nestjs/common";
import { ServicesService } from "./services.service";
import { ApiNotFoundResponse, ApiOkResponse, ApiParam, ApiProduces, ApiTags } from "@nestjs/swagger";
import ServiceDto from "./dto/service.dto";
import { AreaDto } from "./dto/area.dto";
import { UuidParamDto } from "../param-validators.dto";

@ApiTags("Services")
@ApiProduces("application/json")
@Controller("services")
export class ServicesController {
	constructor(private readonly servicesService: ServicesService) {}

	@ApiOkResponse({
		description: "Returns the available services",
		type: [ServiceDto],
	})
	@Get()
	async getServices() {
		return this.servicesService.getServices(true);
	}

	@ApiOkResponse({
		description: "Returns the service with the given id",
		type: ServiceDto,
	})
	@ApiNotFoundResponse({
		description: "The service with the given id does not exist",
	})
	@ApiParam({
		description: "The UUID of the service to get",
		name: "uuid",
	})
	@Get("/:uuid")
	async getService(@Param() { uuid: serviceId }: UuidParamDto) {
		const service = await this.servicesService.getService(serviceId, true);
		if (!service) throw new NotFoundException("Service not found");
		return service;
	}

	@ApiOkResponse({
		description: "Returns the actions for the service with the given id",
		type: [AreaDto],
	})
	@ApiNotFoundResponse({
		description: "The service with the given id does not exist",
	})
	@ApiParam({
		description: "The UUID of the service to get action from",
		name: "uuid",
	})
	@Get("/:uuid/actions")
	async getActionsForService(@Param() { uuid: serviceId }: UuidParamDto) {
		const actions = await this.servicesService.getAREAsForService(serviceId, true);
		if (!actions) throw new NotFoundException("Service not found");
		return actions;
	}

	@ApiOkResponse({
		description: "Returns the reactions for the service with the given id",
		type: [AreaDto],
	})
	@ApiNotFoundResponse({
		description: "The service with the given id does not exist",
	})
	@ApiParam({
		description: "The UUID of the service to get reactions from",
		name: "uuid",
	})
	@Get("/:uuid/reactions")
	async getReactionsForService(@Param() { uuid: serviceId }: UuidParamDto) {
		const reactions = await this.servicesService.getAREAsForService(serviceId, false);
		if (!reactions) throw new NotFoundException("Service not found");
		return reactions;
	}
}
