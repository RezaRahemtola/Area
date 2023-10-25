export const LANGUAGES = ["en", "fr", "is"] as const;
export type Language = (typeof LANGUAGES)[number];

export const THEMES = ["light", "dark", "auto"] as const;
export type Theme = (typeof THEMES)[number];
