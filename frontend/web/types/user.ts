export type Credentials = {
	email: string;
	password: string;
};

export type AuthResult = {
	accessToken: string;
};

const INTERFACE_THEMES = ["auto", "light", "dark"] as const;
export type InterfaceTheme = (typeof INTERFACE_THEMES)[number];
export type InterfaceLanguage = "en" | "fr";

export type UserProfileUpdate = {
	email?: string;
	language?: InterfaceLanguage;
	theme?: InterfaceTheme;
};

export type User = {
	id: string;
	isAdmin: boolean;
	email: string;
	createdAt: string;
	settings: {
		language: InterfaceLanguage;
		theme: InterfaceTheme;
	};
};
