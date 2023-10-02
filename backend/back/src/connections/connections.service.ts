import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import UserConnection from "./entities/user-connection.entity";
import { Repository } from "typeorm";
import { ServicesService } from "../services/services.service";
import { HttpService } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";

type GithubOAuthResponse = {
	access_token: string;
	scope: string;
	token_type: string;
};

@Injectable()
export class ConnectionsService {
	constructor(
		@InjectRepository(UserConnection)
		private readonly userConnectionRepository: Repository<UserConnection>,
		private readonly servicesService: ServicesService,
		private readonly httpService: HttpService,
		private readonly configService: ConfigService,
	) {}

	async createUserConnection(userId: string, serviceId: string, scopes: string[], token: string) {
		if (await this.userConnectionRepository.exist({ where: { userId, serviceId } }))
			throw new ConflictException("User is already connected to this service");
		const userConnection = this.userConnectionRepository.create({
			userId,
			serviceId,
			token,
			scopes: scopes.map((scope) => ({ serviceId, id: scope })),
		});
		return await this.userConnectionRepository.save(userConnection);
	}

	// TODO: Clean this mess
	async createGitHubConnection(userId: string, scopes: string[], code: string) {
		const {
			data: { access_token: token },
		} = await this.httpService.axiosRef.post<GithubOAuthResponse>(
			"https://github.com/login/oauth/access_token",
			{
				client_id: this.configService.getOrThrow<string>("GITHUB_CLIENT_ID"),
				client_secret: this.configService.getOrThrow<string>("GITHUB_CLIENT_SECRET"),
				code,
			},
			{
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
				},
			},
		);
		return this.createUserConnection(userId, "github", scopes, token);
	}

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
