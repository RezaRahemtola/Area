import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "@/locales/en-US";

i18n.use(initReactI18next).init({
	resources: {
		en: {
			translation: en,
		},
	},
	fallbackLng: "en",

	interpolation: {
		escapeValue: false,
	},
});
