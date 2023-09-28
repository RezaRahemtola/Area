import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import UserConnection from "./entities/user-connection.entity";
import { Repository } from "typeorm";
import { ServicesService } from "../services/services.service";

@Injectable()
export class ConnectionsService {
	constructor(
		@InjectRepository(UserConnection)
		private readonly userConnectionRepository: Repository<UserConnection>,
		private readonly servicesService: ServicesService,
	) {}

	getUserConnections(userId: string) {
		return this.userConnectionRepository.find({
			where: { userId },
			relations: { scopes: true },
			select: {
				serviceId: true,
				token: true,
			},
		});
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
