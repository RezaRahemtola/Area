import { atomWithStorage } from "jotai/utils";

import { InterfaceLanguage, InterfaceTheme } from "@/types/user";

export const interfaceThemeAtom = atomWithStorage<InterfaceTheme>("interfaceTheme", "auto");
export const interfaceLanguageAtom = atomWithStorage<InterfaceLanguage>("interfaceLanguage", "en");
export const userAuthTokenAtom = atomWithStorage<string | null>("areaAuthToken", null);
