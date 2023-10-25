import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "@/locales/en-US";
import fr from "@/locales/fr-FR";
import is from "@/locales/is-IS";

i18n.use(initReactI18next).init({
	resources: {
		en: {
			translation: en,
		},
		fr: {
			translation: fr,
		},
		is: {
			translation: is,
		},
	},
	fallbackLng: "en",

	interpolation: {
		escapeValue: false,
	},
});

export default i18n;
