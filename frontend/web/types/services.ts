export type Service = {
	id: string;
	name: string;
	imageUrl: string;
	scopes: string[];
};

export type Area = {
	id: string;
	name: string;
	serviceScopesNeeded: string[];
};
