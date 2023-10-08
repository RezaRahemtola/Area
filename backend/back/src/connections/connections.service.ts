import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import UserConnection from "./entities/user-connection.entity";
import { In, Repository } from "typeorm";
import { ServicesService } from "../services/services.service";
import ServiceScope from "../services/entities/service-scope.entity";

@Injectable()
export class ConnectionsService {
	constructor(
		@InjectRepository(UserConnection)
		private readonly userConnectionRepository: Repository<UserConnection>,
		private readonly servicesService: ServicesService,
		@InjectRepository(ServiceScope)
		private readonly serviceScopesRepository: Repository<ServiceScope>,
	) {}

	async getNewScopesForConnection(userId: string, serviceId: string, scopes: string[]): Promise<string[]> {
		if ((await this.serviceScopesRepository.count({ where: { serviceId, id: In(scopes) } })) !== scopes.length)
			throw new NotFoundException("One or more scopes are invalid");
		const connection = await this.userConnectionRepository.findOne({
			where: { userId, serviceId },
			relations: { scopes: true },
		});
		if (!connection) return scopes;
		const connectionScopes = connection.scopes.map(({ id }) => id);
		if (scopes.every((scope) => connectionScopes.includes(scope))) return [];
		return [...new Set([...scopes, ...connectionScopes])];
	}

	async createUserConnection(userId: string, serviceId: string, scopes: string[], data: unknown) {
		const userConnection = this.userConnectionRepository.create({
			userId,
			serviceId,
			data,
			scopes: scopes.map((scope) => ({ serviceId, id: scope })),
		});
		return await this.userConnectionRepository.save(userConnection);
	}

	async getUserConnections(userId: string) {
		return (
			await this.userConnectionRepository.find({
				where: { userId },
				relations: { scopes: true },
				select: {
					serviceId: true,
					scopes: true,
					createdAt: true,
				},
			})
		).map(({ serviceId, scopes, createdAt }) => ({ serviceId, scopes: scopes.map(({ id }) => id), createdAt }));
	}

	async getAvailableConnections(userId: string): Promise<string[]> {
		const services = await this.servicesService.getServices();
		const userConnections = await this.getUserConnections(userId);
		const availableServices = services.filter(
			(service) => !userConnections.some((userConnection) => userConnection.serviceId === service.id),
		);
		return availableServices.map((service) => service.id);
	}

	async deleteUserConnection(userId: string, serviceId: string) {
		if (!(await this.userConnectionRepository.exist({ where: { userId, serviceId } })))
			throw new NotFoundException("User is not connected to this service");
		return this.userConnectionRepository
			.delete({ userId, serviceId })
			.then(() => true)
			.catch(() => false);
	}
}
