import { forwardRef, Inject, Injectable, Logger } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";
import { ServiceName, ServicesService, SubServiceNameFromServiceName } from "../services/services.service";
import { createHash } from "node:crypto";

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

type SlackOAuthResponse = {
	ok?: boolean;
	bot_user_id?: string;
	app_id?: string;
	team?: {
		id: string;
		name: string;
	};
	enterprise?: {
		id: string;
		name: string;
	};
	authed_user?: {
		id: string;
	} & OAuthResponse;
} & OAuthResponse;

export type UserConnectionData = {
	scopes: string[];
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	data: Record<string, any>;
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
type ServiceOAuthFactory<TService extends ServiceName> = {
	urlFactory: ServiceOAuthUrlFactory<TService>;
	connectionFactory: (code: string, granted_scopes?: string) => Promise<UserConnectionData>;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	getEmailForConnectionData?: (data: Record<string, any>) => Promise<string>;
	loginScopes?: string[];
};
type ServiceOAuthFactories<TServices extends ServiceName> = {
	[TService in TServices]: ServiceOAuthFactory<TService>;
};

@Injectable()
export class OauthService {
	private readonly logger = new Logger(OauthService.name);
	private readonly OAUTH_CODE_CHALLENGE = this.configService.getOrThrow<string>("OAUTH_CODE_CHALLENGE");
	private readonly OAUTH_CODE_CHALLENGE_S265_HASH: string;

	constructor(
		private readonly httpService: HttpService,
		private readonly configService: ConfigService,
		@Inject(forwardRef(() => ServicesService))
		private readonly servicesService: ServicesService,
	) {
		const sha256Hash = createHash("sha256").update(this.OAUTH_CODE_CHALLENGE);
		this.OAUTH_CODE_CHALLENGE_S265_HASH = sha256Hash.digest("base64url");
	}

	async createGitHubConnection(code: string) {
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
		return {
			scopes: scope !== " " ? scope.split(",") : [],
			data: connectionData,
		};
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	async getEmailForGitHubConnection({ token_type, access_token }: Record<string, any>) {
		const {
			data: [{ email }],
		} = await this.httpService.axiosRef.get<[{ email: string }]>("https://api.github.com/user/emails", {
			headers: {
				Accept: "application/vnd.github.v3+json",
				Authorization: `${token_type} ${access_token}`,
				"Content-Type": "application/x-www-form-urlencoded",
			},
			data: {
				per_page: 1,
			},
		});
		return email;
	}

	async createGoogleConnection(code: string) {
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
		return {
			scopes: scope.split(" "),
			data: connectionData,
		};
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	async getEmailForGoogleConnection({ token_type, access_token }: Record<string, any>) {
		const {
			data: { email },
		} = await this.httpService.axiosRef.get<{ email: string }>("https://www.googleapis.com/userinfo/v2/me", {
			headers: {
				Authorization: `${token_type} ${access_token}`,
			},
		});
		return email;
	}

	async createTwitterConnection(code: string) {
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
		return {
			scopes: scope.split(" "),
			data: connectionData,
		};
	}

	async createLinkedInConnection(code: string) {
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
		return {
			scopes: scope.includes(" ") ? scope.split(" ") : scope.split(","),
			data: connectionData,
		};
	}

	async createMicrosoftConnection(code: string, subService: SubServiceNameFromServiceName<ServiceName, "microsoft">) {
		const {
			data: { scope, ...connectionData },
		} = await this.httpService.axiosRef.post<OAuthResponse>(
			"https://login.microsoftonline.com/common/oauth2/v2.0/token",
			{
				client_id: this.configService.getOrThrow<string>("MICROSOFT_CLIENT_ID"),
				client_secret: this.configService.getOrThrow<string>("MICROSOFT_CLIENT_SECRET"),
				code,
				grant_type: "authorization_code",
				redirect_uri: this.OAUTH_CALLBACK_URL_FACTORY(`microsoft-${subService}`),
			},
			{
				headers: {
					Accept: "application/json",
					"Content-Type": "application/x-www-form-urlencoded",
				},
			},
		);
		return {
			scopes: scope.split(" "),
			data: connectionData,
		};
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	async getEmailForMicrosoftGraphConnection({ token_type, access_token }: Record<string, any>) {
		const {
			data: { mail },
		} = await this.httpService.axiosRef.get<{ mail: string }>("https://graph.microsoft.com/v1.0/me", {
			headers: {
				Authorization: `${token_type} ${access_token}`,
			},
		});
		return mail;
	}

	async createFacebookConnection(code: string, granted_scopes?: string) {
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
		return {
			scopes: granted_scopes.split(","),
			data: connectionData,
		};
	}

	async createMiroConnection(code: string) {
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
		return {
			scopes: scope.split(" "),
			data: connectionData,
		};
	}

	async createLinearConnection(code: string) {
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
		return {
			scopes: scope,
			data: connectionData,
		};
	}

	async createDiscordConnection(code: string) {
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
		return {
			scopes: scope.split(" "),
			data: connectionData,
		};
	}

	async createGitlabConnection(code: string) {
		const {
			data: { scope, ...connectionData },
		} = await this.httpService.axiosRef.post<OAuthResponse>(
			"https://gitlab.com/oauth/token",
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
		return {
			scopes: scope.split(" "),
			data: connectionData,
		};
	}

	async createAirTableConnection(code: string) {
		const {
			data: { scope, ...connectionData },
		} = await this.httpService.axiosRef.post<OAuthResponse>(
			"https://airtable.com/oauth2/v1/token",
			{
				code,
				client_id: this.configService.getOrThrow<string>("AIRTABLE_CLIENT_ID"),
				client_secret: this.configService.getOrThrow<string>("AIRTABLE_CLIENT_SECRET"),
				redirect_uri: this.OAUTH_CALLBACK_URL_FACTORY("airtable"),
				grant_type: "authorization_code",
				code_verifier: this.OAUTH_CODE_CHALLENGE,
			},
			{
				headers: {
					Accept: "application/json",
					"Content-Type": "application/x-www-form-urlencoded",
					Authorization: `Basic ${Buffer.from(
						`${this.configService.getOrThrow<string>("AIRTABLE_CLIENT_ID")}:${this.configService.getOrThrow<string>(
							"AIRTABLE_CLIENT_SECRET",
						)}`,
					).toString("base64")}`,
				},
			},
		);
		return {
			scopes: scope.split(" "),
			data: connectionData,
		};
	}

	async createTodoistConnection(code: string) {
		const { data } = await this.httpService.axiosRef.post<OAuthResponse>(
			"https://todoist.com/oauth/access_token",
			{
				code,
				client_id: this.configService.getOrThrow<string>("TODOIST_CLIENT_ID"),
				client_secret: this.configService.getOrThrow<string>("TODOIST_CLIENT_SECRET"),
			},
			{
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
					Accept: "application/json",
				},
			},
		);
		return {
			scopes: ["task:add", "data:read", "data:read_write", "data:delete", "project:delete"],
			data,
		};
	}

	async createSlackConnection(code: string) {
		const {
			data: {
				authed_user: { scope, ...authedUserConnectionData },
				...connectionData
			},
		} = await this.httpService.axiosRef.post<SlackOAuthResponse>(
			"https://slack.com/api/oauth.v2.access",
			{
				code,
				client_id: this.configService.getOrThrow<string>("SLACK_CLIENT_ID"),
				client_secret: this.configService.getOrThrow<string>("SLACK_CLIENT_SECRET"),
				grant_type: "authorization_code",
				redirect_uri: this.OAUTH_CALLBACK_URL_FACTORY("slack"),
			},
			{
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
					Accept: "application/json",
				},
			},
		);
		return {
			scopes: scope.split(","),
			data: { ...connectionData, authed_user: authedUserConnectionData },
		};
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
	) => ServiceOAuthFactory<`microsoft-${TSubService}`> = (subService) => ({
		urlFactory: (baseUrl, userId, scopes, oauthCallbackUrlFactory) =>
			`${baseUrl}?client_id=${this.configService.getOrThrow("MICROSOFT_CLIENT_ID")}&scope=${encodeURI(
				["offline_access", ...scopes].join(" "),
			)}&prompt=consent&response_mode=query&state=${userId}&response_type=code&redirect_uri=${oauthCallbackUrlFactory(
				`microsoft-${subService}`,
			)}`,
		connectionFactory: (code) => this.createMicrosoftConnection(code, subService),
	});

	public readonly SERVICE_OAUTH_FACTORIES: ServiceOAuthFactories<ServiceName> = {
		github: {
			urlFactory: (baseUrl, userId, scopes, oauthCallbackUrlFactory) =>
				`${baseUrl}?client_id=${this.configService.getOrThrow("GITHUB_CLIENT_ID")}&scope=${scopes.join(
					",",
				)}&state=${userId}&redirect_uri=${oauthCallbackUrlFactory("github")}`,
			connectionFactory: this.createGitHubConnection.bind(this),
			loginScopes: ["user:email"],
			getEmailForConnectionData: this.getEmailForGitHubConnection.bind(this),
		},
		google: {
			urlFactory: (baseUrl, userId, scopes, oauthCallbackUrlFactory) =>
				`${baseUrl}?client_id=${this.configService.getOrThrow("GOOGLE_CLIENT_ID")}&scope=${encodeURI(
					scopes.join(" "),
				)}&access_type=offline&response_type=code&state=${userId}&prompt=consent&redirect_uri=${oauthCallbackUrlFactory(
					"google",
				)}`,
			connectionFactory: this.createGoogleConnection.bind(this),
			getEmailForConnectionData: this.getEmailForGoogleConnection.bind(this),
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
		"microsoft-graph": {
			...this.MICROSOFT_SUBSERVICES_OAUTH_FACTORY_FACTORY("graph"),
			getEmailForConnectionData: this.getEmailForMicrosoftGraphConnection.bind(this),
			loginScopes: ["User.Read"],
		},
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
			connectionFactory: this.createGitlabConnection.bind(this),
		},
		airtable: {
			urlFactory: (baseUrl, userId, scopes, oauthCallbackUrlFactory) =>
				`${baseUrl}?response_type=code&client_id=${this.configService.getOrThrow(
					"AIRTABLE_CLIENT_ID",
				)}&scope=${encodeURI(scopes.join(" "))}&redirect_uri=${oauthCallbackUrlFactory("airtable")}&code_challenge=${
					this.OAUTH_CODE_CHALLENGE_S265_HASH
				}&code_challenge_method=S256&state=${userId}`,
			connectionFactory: this.createAirTableConnection.bind(this),
		},
		todoist: {
			urlFactory: (baseUrl, userId, scopes, oauthCallbackUrlFactory) =>
				`${baseUrl}?response_type=code&client_id=${this.configService.getOrThrow(
					"TODOIST_CLIENT_ID",
				)}&scope=${encodeURI(
					["task:add", "data:read", "data:read_write", "data:delete", "project:delete"].join(","),
				)}&redirect_uri=${oauthCallbackUrlFactory("todoist")}&state=${userId}`,
			connectionFactory: this.createTodoistConnection.bind(this),
		},
		slack: {
			urlFactory: (baseUrl, userId, scopes, oauthCallbackUrlFactory) =>
				`${baseUrl}?response_type=code&client_id=${this.configService.getOrThrow(
					"SLACK_CLIENT_ID",
				)}&user_scope=${encodeURI(scopes.join(","))}&redirect_uri=${encodeURI(
					oauthCallbackUrlFactory("slack"),
				)}&state=${userId}`,
			connectionFactory: this.createSlackConnection.bind(this),
		},
		riot: {
			urlFactory: () => {
				throw new Error("Cannot create OAuth URL for riot service");
			},
			connectionFactory: () => {
				throw new Error("Cannot create OAuth connection for riot service");
			},
		},
	};
}
