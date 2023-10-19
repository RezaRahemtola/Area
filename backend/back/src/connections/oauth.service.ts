import { Injectable } from "@nestjs/common";
import { ConnectionsService } from "./connections.service";
import { HttpService } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";
import { ServiceName, ServicesService } from "../services/services.service";
import UserConnection from "./entities/user-connection.entity";

type OAuthResponse = {
	access_token: string;
	scope: string;
	token_type?: string;
	refresh_token?: string;
	expires_in?: number;
	ext_expires_in?: number;
};

type OAuthCallbackUrlFactory<TWantedService extends ServiceName> = <TActualService extends TWantedService>(
	service: TActualService,
) => `${string}/connections/oauth/${TActualService}/callback`;
type ServiceOAuthUrlFactory<TService extends ServiceName> = <TBaseUrl extends string>(
	baseUrl: TBaseUrl,
	userId: string,
	scopes: string[],
	oauthCallbackUrlFactory: OAuthCallbackUrlFactory<TService>,
) => `${TBaseUrl}${string}`;
type ServiceOAuthFactories<TServices extends ServiceName> = {
	[TService in TServices]: {
		urlFactory: ServiceOAuthUrlFactory<TService>;
		connectionFactory: (userId: string, code: string) => Promise<UserConnection>;
	};
};

@Injectable()
export class OauthService {
	public readonly SERVICE_OAUTH_FACTORIES: ServiceOAuthFactories<ServiceName> = {
		github: {
			urlFactory: (baseUrl, userId, scopes, oauthCallbackUrlFactory) =>
				`${baseUrl}?client_id=${this.configService.getOrThrow("GITHUB_CLIENT_ID")}&scope=${scopes.join(
					",",
				)}&state=${userId}&redirect_uri=${oauthCallbackUrlFactory("github")}`,
			connectionFactory: this.createGitHubConnection.bind(this),
		},
		google: {
			urlFactory: (baseUrl, userId, scopes, oauthCallbackUrlFactory) =>
				`${baseUrl}?client_id=${this.configService.getOrThrow("GOOGLE_CLIENT_ID")}&scope=${encodeURI(
					scopes.join(" "),
				)}&access_type=offline&response_type=code&state=${userId}&prompt=consent&redirect_uri=${oauthCallbackUrlFactory(
					"google",
				)}`,
			connectionFactory: this.createGoogleConnection.bind(this),
		},
		twitter: {
			urlFactory: (baseUrl, userId, scopes, oauthCallbackUrlFactory) =>
				`${baseUrl}?client_id=${this.configService.getOrThrow("TWITTER_CLIENT_ID")}&scope=${encodeURI(
					["offline.access", ...scopes].join(" "),
				)}&response_type=code&state=${userId}&code_challenge=challenge&code_challenge_method=plain&redirect_uri=${oauthCallbackUrlFactory(
					"twitter",
				)}`,
			connectionFactory: this.createTwitterConnection.bind(this),
		},
		timer: {
			urlFactory: () => {
				throw new Error("Cannot create OAuth URL for timer service");
			},
			connectionFactory: () => {
				throw new Error("Cannot create OAuth connection for timer service");
			},
		},
		linkedin: {
			urlFactory: (baseUrl, userId, scopes, oauthCallbackUrlFactory) =>
				`${baseUrl}?client_id=${this.configService.getOrThrow("LINKEDIN_CLIENT_ID")}&scope=${encodeURI(
					scopes.join(" "),
				)}&state=${userId}&response_type=code&redirect_uri=${oauthCallbackUrlFactory("linkedin")}`,
			connectionFactory: this.createLinkedInConnection.bind(this),
		},
		microsoft: {
			urlFactory: (baseUrl, userId, scopes, oauthCallbackUrlFactory) =>
				`${baseUrl}?client_id=${this.configService.getOrThrow("MICROSOFT_CLIENT_ID")}&scope=${encodeURI(
					["offline_access", ...scopes].join(" "),
				)}&prompt=consent&response_mode=query&state=${userId}&response_type=code&redirect_uri=${oauthCallbackUrlFactory(
					"microsoft",
				)}`,
			connectionFactory: this.createMicrosoftConnection.bind(this),
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
		} = await this.httpService.axiosRef.post<OAuthResponse>(
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
		} = await this.httpService.axiosRef.post<OAuthResponse>(
			"https://www.googleapis.com/oauth2/v4/token",
			{
				client_id: this.configService.getOrThrow<string>("GOOGLE_CLIENT_ID"),
				client_secret: this.configService.getOrThrow<string>("GOOGLE_CLIENT_SECRET"),
				code,
				grant_type: "authorization_code",
				redirect_uri: this.OAUTH_CALLBACK_URL_FACTORY("google"),
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
		} = await this.httpService.axiosRef.post<OAuthResponse>(
			"https://api.twitter.com/2/oauth2/token",
			{
				code,
				grant_type: "authorization_code",
				redirect_uri: this.OAUTH_CALLBACK_URL_FACTORY("twitter"),
				code_verifier: "challenge",
			},
			{
				headers: {
					Accept: "application/json",
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

	async createLinkedInConnection(userId: string, code: string) {
		const {
			data: { scope, ...connectionData },
		} = await this.httpService.axiosRef.post<OAuthResponse>(
			"https://www.linkedin.com/oauth/v2/accessToken",
			{
				client_id: this.configService.getOrThrow<string>("LINKEDIN_CLIENT_ID"),
				client_secret: this.configService.getOrThrow<string>("LINKEDIN_CLIENT_SECRET"),
				code,
				grant_type: "authorization_code",
				redirect_uri: this.OAUTH_CALLBACK_URL_FACTORY("linkedin"),
			},
			{
				headers: {
					Accept: "application/json",
					"Content-Type": "application/x-www-form-urlencoded",
				},
			},
		);
		return this.connectionsService.createUserConnection(userId, "linkedin", scope.split(","), connectionData);
	}

	async createMicrosoftConnection(userId: string, code: string) {
		const {
			data: { scope, ...connectionData },
		} = await this.httpService.axiosRef.post<OAuthResponse>(
			"https://login.microsoftonline.com/common/oauth2/v2.0/token",
			{
				client_id: this.configService.getOrThrow<string>("MICROSOFT_CLIENT_ID"),
				client_secret: this.configService.getOrThrow<string>("MICROSOFT_CLIENT_SECRET"),
				code,
				grant_type: "authorization_code",
				redirect_uri: this.OAUTH_CALLBACK_URL_FACTORY("microsoft"),
			},
			{
				headers: {
					Accept: "application/json",
					"Content-Type": "application/x-www-form-urlencoded",
				},
			},
		);
		console.log(scope);
		return this.connectionsService.createUserConnection(userId, "microsoft", scope.split(" "), connectionData);
	}

	async getOAuthUrlForServiceUserAndScopes(userId: string, serviceId: ServiceName, scopes: string[]) {
		const { oauthUrl } = await this.servicesService.getService(serviceId);
		return this.SERVICE_OAUTH_FACTORIES[serviceId].urlFactory(
			oauthUrl,
			userId,
			scopes,
			this.OAUTH_CALLBACK_URL_FACTORY,
		);
	}

	private readonly OAUTH_CALLBACK_URL_FACTORY: OAuthCallbackUrlFactory<ServiceName> = (service) =>
		`${this.configService.getOrThrow<string>("BACK_BASE_URL")}/connections/oauth/${service}/callback`;
}
