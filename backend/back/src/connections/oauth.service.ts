import { Injectable, Logger } from "@nestjs/common";
import { ConnectionsService } from "./connections.service";
import { HttpService } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";
import { ServiceName, ServicesService, SubServiceNameFromServiceName } from "../services/services.service";
import UserConnection from "./entities/user-connection.entity";

type OAuthResponse = {
	access_token: string;
	scope: string;
	token_type?: string;
	refresh_token?: string;
	expires_in?: number;
	ext_expires_in?: number;
};

type MiroOAuthResponse = {
	team_id: string;
	user_id: string;
} & OAuthResponse;

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
		connectionFactory: (userId: string, code: string, granted_scopes?: string) => Promise<UserConnection>;
	};
};

@Injectable()
export class OauthService {
	private readonly logger = new Logger(OauthService.name);

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
		return this.connectionsService.createUserConnection(
			userId,
			"github",
			scope !== "" ? scope.split(",") : [],
			connectionData,
		);
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

	async createMicrosoftConnection(
		userId: string,
		code: string,
		subservice: SubServiceNameFromServiceName<ServiceName, "microsoft">,
	) {
		const {
			data: { scope, ...connectionData },
		} = await this.httpService.axiosRef.post<OAuthResponse>(
			"https://login.microsoftonline.com/common/oauth2/v2.0/token",
			{
				client_id: this.configService.getOrThrow<string>("MICROSOFT_CLIENT_ID"),
				client_secret: this.configService.getOrThrow<string>("MICROSOFT_CLIENT_SECRET"),
				code,
				grant_type: "authorization_code",
				redirect_uri: this.OAUTH_CALLBACK_URL_FACTORY(`microsoft-${subservice}`),
			},
			{
				headers: {
					Accept: "application/json",
					"Content-Type": "application/x-www-form-urlencoded",
				},
			},
		);
		return this.connectionsService.createUserConnection(
			userId,
			`microsoft-${subservice}`,
			scope.split(" "),
			connectionData,
		);
	}

	async createFacebookConnection(userId: string, code: string, granted_scopes?: string) {
		const {
			data: { ...connectionData },
		} = await this.httpService.axiosRef.post<OAuthResponse>(
			"https://graph.facebook.com/v18.0/oauth/access_token",
			{
				client_id: this.configService.getOrThrow<string>("FACEBOOK_CLIENT_ID"),
				client_secret: this.configService.getOrThrow<string>("FACEBOOK_CLIENT_SECRET"),
				code,
				redirect_uri: this.OAUTH_CALLBACK_URL_FACTORY("facebook"),
			},
			{
				headers: {
					Accept: "application/json",
					"Content-Type": "application/x-www-form-urlencoded",
				},
			},
		);
		return this.connectionsService.createUserConnection(userId, "facebook", granted_scopes.split(","), connectionData);
	}

	async createMiroConnection(userId: string, code: string) {
		const {
			data: { scope, ...connectionData },
		} = await this.httpService.axiosRef.post<MiroOAuthResponse>(
			"https://api.miro.com/v1/oauth/token",
			{
				client_id: this.configService.getOrThrow<string>("MIRO_CLIENT_ID"),
				client_secret: this.configService.getOrThrow<string>("MIRO_CLIENT_SECRET"),
				code,
				redirect_uri: this.OAUTH_CALLBACK_URL_FACTORY("miro"),
				grant_type: "authorization_code",
			},
			{
				headers: {
					Accept: "application/json",
					"Content-Type": "application/x-www-form-urlencoded",
				},
			},
		);
		return this.connectionsService.createUserConnection(userId, "miro", scope.split(" "), connectionData);
	}

	async createLinearConnection(userId: string, code: string) {
		const {
			data: { scope, ...connectionData },
		} = await this.httpService.axiosRef.post<Omit<OAuthResponse, "scope"> & { scope: string[] }>(
			"https://api.linear.app/oauth/token",
			{
				client_id: this.configService.getOrThrow<string>("LINEAR_CLIENT_ID"),
				client_secret: this.configService.getOrThrow<string>("LINEAR_CLIENT_SECRET"),
				code,
				redirect_uri: this.OAUTH_CALLBACK_URL_FACTORY("linear"),
				grant_type: "authorization_code",
			},
			{
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
					Accept: "application/json",
				},
			},
		);
		return this.connectionsService.createUserConnection(userId, "linear", scope, connectionData);
	}

	async createDiscordConnection(userId: string, code: string) {
		const {
			data: { scope, ...connectionData },
		} = await this.httpService.axiosRef.post<OAuthResponse>(
			"https://discord.com/api/oauth2/token",
			{
				code,
				redirect_uri: this.OAUTH_CALLBACK_URL_FACTORY("discord"),
				grant_type: "authorization_code",
			},
			{
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
					Accept: "application/json",
				},
				auth: {
					username: this.configService.getOrThrow<string>("DISCORD_CLIENT_ID"),
					password: this.configService.getOrThrow<string>("DISCORD_CLIENT_SECRET"),
				},
			},
		);
		return this.connectionsService.createUserConnection(userId, "discord", scope.split(" "), connectionData);
	}

	async createGitlabConnection(userId: string, code: string) {
		try {
			const {
				data: { scope, ...connectionData },
			} = await this.httpService.axiosRef.post<OAuthResponse>(
				"https://gitlab.com/oauth/authorize",
				{
					client_id: this.configService.getOrThrow<string>("GITLAB_CLIENT_ID"),
					client_secret: this.configService.getOrThrow<string>("GITLAB_CLIENT_SECRET"),
					code,
					redirect_uri: this.OAUTH_CALLBACK_URL_FACTORY("gitlab"),
					grant_type: "authorization_code",
				},
				{
					headers: {
						Accept: "application/json",
						"Content-Type": "application/x-www-form-urlencoded",
					},
				},
			);
			this.logger.debug(JSON.stringify(connectionData));
			return this.connectionsService.createUserConnection(userId, "gitlab", scope.split("+"), connectionData);
		} catch (e) {
			console.error(e);
			throw e;
		}
	}

	async getOAuthUrlForServiceUserAndScopes(userId: string, serviceId: ServiceName, scopes: string[]) {
		const { oauthUrl } = await this.servicesService.getService(serviceId);
		this.logger.log(`Creating OAuth URL for service ${serviceId} and user ${userId} with scopes ${scopes.join(", ")}`);
		return this.SERVICE_OAUTH_FACTORIES[serviceId].urlFactory(
			oauthUrl,
			userId,
			scopes,
			this.OAUTH_CALLBACK_URL_FACTORY,
		);
	}

	private readonly OAUTH_CALLBACK_URL_FACTORY: OAuthCallbackUrlFactory<ServiceName> = (service) =>
		`${this.configService.getOrThrow<string>("BACK_BASE_URL")}/connections/oauth/${service}/callback`;

	private readonly MICROSOFT_SUBSERVICES_OAUTH_FACTORY_FACTORY: <
		TSubService extends SubServiceNameFromServiceName<ServiceName, "microsoft">,
	>(
		subService: TSubService,
	) => {
		urlFactory: ServiceOAuthUrlFactory<`microsoft-${TSubService}`>;
		connectionFactory: (userId: string, code: string, granted_scopes?: string) => Promise<UserConnection>;
	} = (subService) => ({
		urlFactory: (baseUrl, userId, scopes, oauthCallbackUrlFactory) =>
			`${baseUrl}?client_id=${this.configService.getOrThrow("MICROSOFT_CLIENT_ID")}&scope=${encodeURI(
				["offline_access", ...scopes].join(" "),
			)}&prompt=consent&response_mode=query&state=${userId}&response_type=code&redirect_uri=${oauthCallbackUrlFactory(
				`microsoft-${subService}`,
			)}`,
		connectionFactory: (userId, code) => this.createMicrosoftConnection(userId, code, subService),
	});

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
		facebook: {
			urlFactory: (baseUrl, userId, scopes, oauthCallbackUrlFactory) =>
				`${baseUrl}?client_id=${this.configService.getOrThrow("FACEBOOK_CLIENT_ID")}&scope=${encodeURI(
					scopes.join(","),
				)}&state=${userId}&response_type=${encodeURI("code granted_scopes")}&redirect_uri=${oauthCallbackUrlFactory(
					"facebook",
				)}`,
			connectionFactory: this.createFacebookConnection.bind(this),
		},
		miro: {
			urlFactory: (baseUrl, userId, scopes, oauthCallbackUrlFactory) =>
				`${baseUrl}?response_type=code&client_id=${this.configService.getOrThrow(
					"MIRO_CLIENT_ID",
				)}&redirect_uri=${oauthCallbackUrlFactory("miro")}&state=${userId}`,
			connectionFactory: this.createMiroConnection.bind(this),
		},
		"microsoft-graph": this.MICROSOFT_SUBSERVICES_OAUTH_FACTORY_FACTORY("graph"),
		"microsoft-onenote": this.MICROSOFT_SUBSERVICES_OAUTH_FACTORY_FACTORY("onenote"),
		"microsoft-outlook": this.MICROSOFT_SUBSERVICES_OAUTH_FACTORY_FACTORY("outlook"),
		linear: {
			urlFactory: (baseUrl, userId, scopes, oauthCallbackUrlFactory) =>
				`${baseUrl}?response_type=code&client_id=${this.configService.getOrThrow(
					"LINEAR_CLIENT_ID",
				)}&scope=${scopes.join(",")}&redirect_uri=${oauthCallbackUrlFactory("linear")}&state=${userId}&prompt=consent`,
			connectionFactory: this.createLinearConnection.bind(this),
		},
		discord: {
			urlFactory: (baseUrl, userId, scopes, oauthCallbackUrlFactory) =>
				`${baseUrl}?response_type=code&client_id=${this.configService.getOrThrow(
					"DISCORD_CLIENT_ID",
				)}&scope=${encodeURI(scopes.join(" "))}&redirect_uri=${oauthCallbackUrlFactory(
					"discord",
				)}&state=${userId}&prompt=consent`,
			connectionFactory: this.createDiscordConnection.bind(this),
		},
		gitlab: {
			urlFactory: (baseUrl, userId, scopes, oauthCallbackUrlFactory) =>
				`${baseUrl}?response_type=code&client_id=${this.configService.getOrThrow("GITLAB_CLIENT_ID")}&scope=${encodeURI(
					scopes.join("+"),
				)}&redirect_uri=${oauthCallbackUrlFactory("gitlab")}&state=${userId}`,
			connectionFactory: this.createDiscordConnection.bind(this),
		},
	};
}
