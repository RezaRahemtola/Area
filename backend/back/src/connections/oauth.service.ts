import { Injectable } from "@nestjs/common";
import { ConnectionsService } from "./connections.service";
import { HttpService } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";
import { ServicesService } from "../services/services.service";

type GithubOAuthResponse = {
	access_token: string;
	scope: string;
	token_type: string;
};

type OAuthCallbackUrlFactory = (service: string) => `${string}/connections/oauth/${string}/callback`;
type ServiceOAuthUrlFactory = (
	baseUrl: string,
	userId: string,
	scopes: string[],
	oauthCallbackUrlFactory: OAuthCallbackUrlFactory,
) => string;
type ServiceOAuthUrlFactories = Record<string, ServiceOAuthUrlFactory>;

@Injectable()
export class OauthService {
	private readonly SERVICE_OAUTH_URL_FACTORIES: ServiceOAuthUrlFactories = {
		github: (baseUrl, userId, scopes, oauthCallbackUrlFactory) =>
			`${baseUrl}?
		client_id=${this.configService.get("GITHUB_CLIENT_ID")}
		&scope=${scopes.join(",")}
		&redirect_uri=${encodeURI(`${oauthCallbackUrlFactory("github")}?userId=${userId}`)}`,
	};

	constructor(
		private readonly connectionsService: ConnectionsService,
		private readonly httpService: HttpService,
		private readonly configService: ConfigService,
		private readonly servicesService: ServicesService,
	) {}

	async createGitHubConnection(userId: string, code: string) {
		const {
			data: { scope, ...connectionData },
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
		return this.connectionsService.createUserConnection(userId, "github", scope.split(","), connectionData);
	}

	async getOAuthUrlForServiceUserAndScopes(userId: string, serviceId: string, scopes: string[]) {
		const { oauthUrl } = await this.servicesService.getService(serviceId);
		return this.SERVICE_OAUTH_URL_FACTORIES[serviceId](oauthUrl, userId, scopes, this.OAUTH_CALLBACK_URL_FACTORY);
	}

	private readonly OAUTH_CALLBACK_URL_FACTORY: OAuthCallbackUrlFactory = (service) =>
		`${this.configService.getOrThrow<string>("BACK_BASE_URL")}/connections/oauth/${service}/callback`;
}
