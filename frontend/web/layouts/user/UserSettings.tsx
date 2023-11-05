import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useAtom } from "jotai";

import {
	INTERFACE_LANGUAGES,
	INTERFACE_THEMES,
	InterfaceLanguage,
	InterfaceTheme,
	User,
	UserProfileUpdate,
} from "@/types/user";
import services from "@/services";
import { interfaceLanguageAtom, interfaceThemeAtom } from "@/stores/user";
import i18n from "@/config/i18n";
import { emitToastError, emitToastSuccess } from "@/utils/toast";

type UserSettingsProps = {
	user: User;
};
const UserSettings = ({ user }: UserSettingsProps) => {
	const [userSettings, setUserSettings] = useState<UserProfileUpdate>({
		email: user.email,
		theme: user.settings.theme,
		language: user.settings.language,
	});
	const [, setInterfaceTheme] = useAtom(interfaceThemeAtom);
	const [, setInterfaceLanguage] = useAtom(interfaceLanguageAtom);
	const { t } = useTranslation();

	return (
		<div className="w-fit ml-4">
			<div className="mb-4">
				<label className="label">
					<span className="text-base-100 label-text">{t("user.settings.email")}</span>
				</label>
				<input
					type="text"
					value={userSettings.email}
					className="input input-bordered input-primary bg-neutral"
					onChange={(e) => setUserSettings((prev) => ({ ...prev, email: e.target.value }))}
				/>
			</div>

			<div className="mb-4">
				<label className="label">
					<span className="text-base-100 label-text">{t("user.settings.theme")}</span>
				</label>
				<select
					className="select select-bordered select-primary bg-neutral"
					value={userSettings.theme}
					onChange={(e) => {
						setUserSettings((prev) => ({ ...prev, theme: e.target.value as InterfaceTheme }));
					}}
				>
					{INTERFACE_THEMES.map((choice) => (
						<option value={choice} key={choice}>
							{choice}
						</option>
					))}
				</select>
			</div>

			<div className="mb-6">
				<label className="label">
					<span className="text-base-100 label-text">{t("user.settings.language")}</span>
				</label>
				<select
					className="select select-bordered select-primary bg-neutral"
					value={userSettings.language}
					onChange={(e) => {
						setUserSettings((prev) => ({ ...prev, language: e.target.value as InterfaceLanguage }));
					}}
				>
					{INTERFACE_LANGUAGES.map((choice) => (
						<option value={choice.id} key={choice.id}>
							{choice.text}
						</option>
					))}
				</select>
			</div>

			<button
				className="btn btn-secondary text-base-100"
				onClick={async () => {
					const settings = {
						...userSettings,
						email: userSettings.email !== user.email ? userSettings.email : undefined,
					};
					const response = await services.user.updateProfile(settings);
					if (response.error) {
						emitToastError(response.error);
						return;
					}
					setInterfaceTheme(settings.theme!);
					await i18n.changeLanguage(settings.language);
					setInterfaceLanguage(settings.language!);
					emitToastSuccess(t("user.settings.updateSuccessMessage"));
				}}
			>
				{t("actions.save")}
			</button>
		</div>
	);
};

export default UserSettings;
