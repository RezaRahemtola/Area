import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import Service from "./entities/service.entity";
import { Repository } from "typeorm";
import Area from "./entities/area.entity";
import { AreaDto } from "./dto/area.dto";
import { ServiceHasFilter } from "./dto/service-query-filter.dto";

export const SERVICE_NAMES = [
	"timer",
	"github",
	"google",
	"twitter",
	"linkedin",
	"facebook",
	"miro",
	"microsoft-graph",
	"microsoft-onenote",
	"microsoft-outlook",
] as const;
export type ServiceName = (typeof SERVICE_NAMES)[number];

export type SubServiceNameFromServiceName<T extends ServiceName, S extends string> = T extends `${S}-${infer U}`
	? U
	: never;

@Injectable()
export class ServicesService {
	private readonly logger = new Logger(ServicesService.name);

	constructor(
		@InjectRepository(Service)
		private readonly serviceRepository: Repository<Service>,
		@InjectRepository(Area)
		private readonly areaRepository: Repository<Area>,
	) {}

	async getServices(withScopes: boolean = false, has?: ServiceHasFilter) {
		const services = (
			await this.serviceRepository.find({
				relations: {
					scopes: withScopes,
					areas: true,
				},
			})
		).map(({ scopes, ...service }) => ({ ...service, scopes: scopes?.map(({ id }) => id) }));
		const servicesToReturn = services
			.filter(({ areas }) => !has || areas.some(({ isAction }) => (has === "actions" ? isAction : !isAction)))
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			.map(({ areas, ...service }) => ({ ...service }));
		this.logger.log(`Found ${servicesToReturn.length} services`);
		if (has) this.logger.log(`Theses services are all ${has}`);
		return servicesToReturn;
	}

	async getService(
		id: ServiceName,
		withScopes: boolean = false,
	): Promise<
		| (Omit<Service, "scopes"> & {
				scopes?: string[];
		  })
		| null
	> {
		const service = await this.serviceRepository.findOne({ where: { id }, relations: { scopes: withScopes } });
		if (!service) return null;
		if (withScopes) {
			const { scopes, ...serviceDto } = service;
			return { ...serviceDto, scopes: scopes.map(({ id }) => id) };
		}
		return service as Omit<Service, "scopes">;
	}

	async getAREAsForService(serviceId: ServiceName, action: boolean): Promise<AreaDto[] | null> {
		if (!(await this.serviceRepository.findOne({ where: { id: serviceId } }))) return null;
		const areas = await this.areaRepository.find({
			where: { serviceId, isAction: action },
			relations: { serviceScopesNeeded: true },
		});
		this.logger.log(`Found ${areas.length} ${action ? "actions" : "reactions"} for service ${serviceId}`);
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		return areas.map(({ serviceScopesNeeded, isAction, serviceId, ...area }) => ({
			...area,
			serviceScopesNeeded: serviceScopesNeeded.map(({ id }) => id),
		}));
	}
}
