import { Controller, Get, NotFoundException, Param, Query } from "@nestjs/common";
import { ServicesService } from "./services.service";
import { ApiNotFoundResponse, ApiOkResponse, ApiParam, ApiProduces, ApiTags } from "@nestjs/swagger";
import ServiceDto from "./dto/service.dto";
import { AreaDto } from "./dto/area.dto";
import ServiceQueryFilterDto from "./dto/service-query-filter.dto";

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
	async getServices(@Query() { has }: ServiceQueryFilterDto) {
		return this.servicesService.getServices(true, has);
	}

	@ApiOkResponse({
		description: "Returns the service with the given id",
		type: ServiceDto,
	})
	@ApiNotFoundResponse({
		description: "The service with the given id does not exist",
	})
	@ApiParam({
		description: "The id of the service to get",
		name: "id",
	})
	@Get("/:id")
	async getService(@Param("id") serviceId: string) {
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
		description: "The id of the service to get actions from",
		name: "id",
	})
	@Get("/:id/actions")
	async getActionsForService(@Param("id") serviceId: string) {
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
		description: "The id of the service to get reactions from",
		name: "id",
	})
	@Get("/:id/reactions")
	async getReactionsForService(@Param("id") serviceId: string) {
		const reactions = await this.servicesService.getAREAsForService(serviceId, false);
		if (!reactions) throw new NotFoundException("Service not found");
		return reactions;
	}
}
