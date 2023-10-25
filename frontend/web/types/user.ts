export type Credentials = {
	email: string;
	password: string;
};

export type AuthResult = {
	accessToken: string;
};

export const INTERFACE_THEMES = ["auto", "light", "dark"] as const;
export type InterfaceTheme = (typeof INTERFACE_THEMES)[number];
export const INTERFACE_LANGUAGES = [
	{ id: "en", text: "🇺🇸 English" },
	{ id: "fr", text: "🇫🇷 Francais" },
] as const;
export type InterfaceLanguage = (typeof INTERFACE_LANGUAGES)[number]["id"];

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
