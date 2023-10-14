export const LANGUAGES = ["en", "fr", "de", "es", "pt", "it", "nl"] as const;
export type Language = (typeof LANGUAGES)[number];

export const THEMES = ["light", "dark", "auto"] as const;
export type Theme = (typeof THEMES)[number];
