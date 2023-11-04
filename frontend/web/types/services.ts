export type Service = {
	id: string;
	imageUrl: string;
	oauthUrl: string;
	scopes: string[];
};

export type AreaParameterType = "email" | "short-text" | "long-text" | "integer" | "text-array" | "boolean" | "select";

export type AreaParameter = {
	name: string;
	type: AreaParameterType;
	required: boolean;
	values?: string[];
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
