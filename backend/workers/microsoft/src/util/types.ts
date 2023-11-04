import { AuthenticationProvider } from "@microsoft/microsoft-graph-client";

export type MicrosoftResponseError = {
	statusCode: number;
	body: string;
};

export class AccessTokenProvider implements AuthenticationProvider {
	private readonly accessToken: string;

	constructor(accessToken: string) {
		this.accessToken = accessToken;
	}

	async getAccessToken(): Promise<string> {
		return this.accessToken;
	}
}
