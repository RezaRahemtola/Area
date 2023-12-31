import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import UserConnection from "./entities/user-connection.entity";
import { In, Repository } from "typeorm";
import { ServiceName, ServicesService } from "../services/services.service";
import ServiceScope from "../services/entities/service-scope.entity";
import { UsersService } from "../users/users.service";

@Injectable()
export class ConnectionsService {
	private readonly logger = new Logger(ConnectionsService.name);

	constructor(
		@InjectRepository(UserConnection)
		private readonly userConnectionRepository: Repository<UserConnection>,
		private readonly servicesService: ServicesService,
		@InjectRepository(ServiceScope)
		private readonly serviceScopesRepository: Repository<ServiceScope>,
		private readonly usersService: UsersService,
	) {}

	async getNewScopesForConnection(userId: string, serviceId: ServiceName, scopes: string[]): Promise<string[] | null> {
		if ((await this.serviceScopesRepository.count({ where: { serviceId, id: In(scopes) } })) !== scopes.length)
			throw new NotFoundException("One or more scopes are invalid");
		const connection = await this.userConnectionRepository.findOne({
			where: { userId, serviceId },
			relations: { scopes: true },
		});
		if (!connection) {
			this.logger.log(`The user ${userId} is not connected to the service ${serviceId}, they need every scope asked`);
			return scopes;
		}
		const connectionScopes = connection.scopes.map(({ id }) => id);
		if (scopes.every((scope) => connectionScopes.includes(scope))) {
			this.logger.log("The connection already has all the scopes");
			return null;
		}
		const newScopes = [...new Set([...scopes, ...connectionScopes])];
		this.logger.log(
			`The new scopes for connection ${connection.serviceId} of user ${userId} are: ${newScopes.join(", ")}`,
		);
		return newScopes;
	}

	async createUserConnection(userId: string, serviceId: ServiceName, scopes: string[], data: unknown) {
		const userConnection = this.userConnectionRepository.create({
			userId,
			serviceId,
			data,
			scopes: scopes.map((scope) => ({ serviceId, id: scope })),
		});
		this.logger.log(
			`Creating connection ${userConnection.serviceId} for user ${userConnection.userId} with data: ${JSON.stringify(
				data,
				undefined,
				2,
			)} and scopes ${scopes.join(", ")}`,
		);
		return await this.userConnectionRepository.save(userConnection);
	}

	async getUserConnectionForService(userId: string, serviceId: ServiceName) {
		return this.userConnectionRepository.findOne({ where: { userId, serviceId }, relations: { scopes: true } });
	}

	async deleteUserConnection(userId: string, serviceId: ServiceName) {
		if (!(await this.userConnectionRepository.exist({ where: { userId, serviceId } })))
			throw new NotFoundException("User is not connected to this service");
		return this.userConnectionRepository
			.delete({ userId, serviceId })
			.then(() => {
				this.logger.log(`Deleted connection ${serviceId} for user ${userId}`);
				return true;
			})
			.catch(({ message }) => {
				this.logger.error(`Error deleting connection ${serviceId} for user ${userId}: ${message}`);
				return false;
			});
	}

	async createUserAndConnectionForData(
		userEmail: string,
		serviceId: ServiceName,
		scopes: string[],
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		data: Record<string, any>,
	) {
		const user = await this.usersService.createUser(userEmail);
		return [user, await this.createUserConnection(user.id, serviceId, scopes, data)] as const;
	}
}
