import { atomWithStorage } from "jotai/utils";

import { InterfaceTheme } from "@/types/user";

export const interfaceThemeAtom = atomWithStorage<InterfaceTheme>("interfaceTheme", "dark");
export const userAuthTokenAtom = atomWithStorage<string | null>("areaAuthToken", null);
