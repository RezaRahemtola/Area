import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import Service from "./entities/service.entity";
import { Repository } from "typeorm";
import ServiceDto from "./dto/service.dto";
import Area from "./entities/area.entity";
import { AreaDto } from "./dto/area.dto";

@Injectable()
export class ServicesService {
	constructor(
		@InjectRepository(Service)
		private readonly serviceRepository: Repository<Service>,
		@InjectRepository(Area)
		private readonly areaRepository: Repository<Area>,
	) {}

	async getServices(withScopes: boolean = false): Promise<ServiceDto[]> {
		return (
			await this.serviceRepository.find({
				relations: {
					scopes: withScopes,
				},
			})
		).map(({ scopes, ...service }) => ({ ...service, scopes: scopes.map(({ id }) => id) }));
	}

	async getService(id: string, withScopes: boolean = false): Promise<ServiceDto | null> {
		const service = await this.serviceRepository.findOne({ where: { id }, relations: { scopes: withScopes } });
		if (!service) return null;
		const { scopes, ...serviceDto } = service;
		return { ...serviceDto, scopes: scopes.map(({ id }) => id) };
	}

	async getAREAsForService(id: string, action: boolean): Promise<AreaDto[] | null> {
		if (!(await this.serviceRepository.findOne({ where: { id } }))) return null;
		const areas = await this.areaRepository.find({
			where: { serviceId: id, isAction: action },
			relations: { serviceScopesNeeded: true },
		});
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		return areas.map(({ serviceScopesNeeded, isAction, serviceId, ...area }) => ({
			...area,
			serviceScopesNeeded: serviceScopesNeeded.map(({ id }) => id),
		}));
	}
}
