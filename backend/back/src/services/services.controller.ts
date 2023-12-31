import { Controller, Get, NotFoundException, Param, Query } from "@nestjs/common";
import { ServicesService } from "./services.service";
import { ApiNotFoundResponse, ApiOkResponse, ApiParam, ApiProduces, ApiTags } from "@nestjs/swagger";
import ServiceDto from "./dto/service.dto";
import { AreaDto } from "./dto/area.dto";
import ServiceQueryFilterDto from "./dto/service-query-filter.dto";
import { ServiceIdParamDto } from "../param-validators.dto";

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
	async getServices(@Query() serviceQueryFilterDto: ServiceQueryFilterDto) {
		return this.servicesService.getServices(true, serviceQueryFilterDto);
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
		name: "serviceId",
	})
	@Get("/:serviceId")
	async getService(@Param() { serviceId }: ServiceIdParamDto) {
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
		name: "serviceId",
	})
	@Get("/:serviceId/actions")
	async getActionsForService(@Param() { serviceId }: ServiceIdParamDto) {
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
		name: "serviceId",
	})
	@Get("/:serviceId/reactions")
	async getReactionsForService(@Param() { serviceId }: ServiceIdParamDto) {
		const reactions = await this.servicesService.getAREAsForService(serviceId, false);
		if (!reactions) throw new NotFoundException("Service not found");
		return reactions;
	}
}
