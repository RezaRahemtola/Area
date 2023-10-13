import { BadRequestException, Injectable } from "@nestjs/common";
import { ConnectionsService } from "./connections.service";
import { HttpService } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";
import { ServiceName, ServicesService } from "../services/services.service";
import UserConnection from "./entities/user-connection.entity";

type GithubOAuthResponse = {
	access_token: string;
	scope: string;
	token_type: string;
};

type OAuthCallbackUrlFactory<TWantedService extends string> = <TActualService extends TWantedService>(
	service: TActualService,
) => `${string}/connections/oauth/${TActualService}/callback`;
type ServiceOAuthUrlFactory<TService extends string> = <TBaseUrl extends string>(
	baseUrl: TBaseUrl,
	userId: string,
	scopes: string[],
	oauthCallbackUrlFactory: OAuthCallbackUrlFactory<TService>,
) => `${TBaseUrl}${string}`;
type ServiceOAuthFactories<TServices extends string> = {
	[TService in TServices]: {
		urlFactory: ServiceOAuthUrlFactory<TService>;
		connectionFactory: (userId: string, code: string) => Promise<UserConnection>;
	};
};

@Injectable()
export class OauthService {
	public readonly SERVICE_OAUTH_URL_FACTORIES: ServiceOAuthFactories<ServiceName> = {
		github: {
			urlFactory: (baseUrl, userId, scopes, oauthCallbackUrlFactory) =>
				`${baseUrl}?client_id=${this.configService.get("GITHUB_CLIENT_ID")}&scope=${scopes.join(
					",",
				)}&state=${userId}&redirect_uri=${oauthCallbackUrlFactory("github")}`,
			connectionFactory: this.createGitHubConnection.bind(this),
		},
		google: {
			urlFactory: (baseUrl, userId, scopes, oauthCallbackUrlFactory) =>
				`${baseUrl}?client_id=${this.configService.get("GOOGLE_CLIENT_ID")}&scope=${encodeURI(
					scopes.join(" "),
				)}&access_type=offline&response_type=code&state=${userId}&prompt=consent&redirect_uri=${oauthCallbackUrlFactory(
					"google",
				)}`,
			connectionFactory: this.createGoogleConnection.bind(this),
		},
		twitter: {
			urlFactory: (baseUrl, userId, scopes, oauthCallbackUrlFactory) =>
				`${baseUrl}?client_id=${this.configService.get("TWITTER_CLIENT_ID")}&scope=${encodeURI(
					["offline.access", ...scopes].join(" "),
				)}&response_type=code&state=${userId}&code_challenge=challenge&code_challenge_method=plain&redirect_uri=${oauthCallbackUrlFactory(
					"twitter",
				)}`,
			connectionFactory: this.createTwitterConnection.bind(this),
		},
		timer: {
			urlFactory: () => {
				throw new BadRequestException("Cannot create OAuth URL for timer service");
			},
			connectionFactory: () => {
				throw new BadRequestException("Cannot create OAuth connection for timer service");
			},
		},
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

	async createGoogleConnection(userId: string, code: string) {
		const {
			data: { scope, ...connectionData },
		} = await this.httpService.axiosRef.post<unknown & { scope: string }>(
			"https://www.googleapis.com/oauth2/v4/token",
			{
				client_id: this.configService.getOrThrow<string>("GOOGLE_CLIENT_ID"),
				client_secret: this.configService.getOrThrow<string>("GOOGLE_CLIENT_SECRET"),
				code,
				grant_type: "authorization_code",
				redirect_uri: `${this.configService.getOrThrow<string>("BACK_BASE_URL")}/connections/oauth/google/callback`,
			},
			{
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
				},
			},
		);
		return this.connectionsService.createUserConnection(userId, "google", scope.split(" "), connectionData);
	}

	async createTwitterConnection(userId: string, code: string) {
		const {
			data: { scope, ...connectionData },
		} = await this.httpService.axiosRef.post<
			unknown & {
				scope: string;
			}
		>(
			"https://api.twitter.com/2/oauth2/token",
			{
				code,
				grant_type: "authorization_code",
				redirect_uri: `${this.configService.getOrThrow<string>("BACK_BASE_URL")}/connections/oauth/twitter/callback`,
				code_verifier: "challenge",
			},
			{
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
					Authorization: `Basic ${Buffer.from(
						`${this.configService.getOrThrow<string>("TWITTER_CLIENT_ID")}:${this.configService.getOrThrow<string>(
							"TWITTER_CLIENT_SECRET",
						)}`,
					).toString("base64")}`,
				},
			},
		);
		return this.connectionsService.createUserConnection(userId, "twitter", scope.split(" "), connectionData);
	}

	async getOAuthUrlForServiceUserAndScopes(userId: string, serviceId: ServiceName, scopes: string[]) {
		const { oauthUrl } = await this.servicesService.getService(serviceId);
		return this.SERVICE_OAUTH_URL_FACTORIES[serviceId].urlFactory(
			oauthUrl,
			userId,
			scopes,
			this.OAUTH_CALLBACK_URL_FACTORY,
		);
	}

	private readonly OAUTH_CALLBACK_URL_FACTORY: OAuthCallbackUrlFactory<string> = (service) =>
		`${this.configService.getOrThrow<string>("BACK_BASE_URL")}/connections/oauth/${service}/callback`;
}
