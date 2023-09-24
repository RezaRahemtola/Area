import { atomWithStorage } from "jotai/utils";
import { atom } from "jotai";

import { InterfaceTheme } from "@/types/user";

export const interfaceThemeAtom = atomWithStorage<InterfaceTheme>("interfaceTheme", "dark");
export const userRegisteredAtom = atom(false);
