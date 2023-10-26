export type Service = {
	id: string;
	imageUrl: string;
	oauthUrl: string;
	scopes: string[];
};

export type AreaParameterType = "short-text" | "long-text" | "integer" | "text-array";

export type AreaParameter = {
	name: string;
	type: AreaParameterType;
	required: boolean;
};

export type AreaParameterWithValue = AreaParameter & {
	value?: never;
};

export type Area = {
	id: string;
	description: string;
	parametersFormFlow: AreaParameter[];
	serviceScopesNeeded: string[];
};
