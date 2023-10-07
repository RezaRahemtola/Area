export type Service = {
	id: string;
	imageUrl: string;
	oauthUrl: string;
	scopes: string[];
};

export type Area = {
	id: string;
	serviceScopesNeeded: string[];
};
