import { useTranslation } from "react-i18next";
import { User } from "@/types/user";

type UserSettingsProps = {
	user: User;
};
const UserSettings = ({ user }: UserSettingsProps) => {
	const { t } = useTranslation();

	return (
		<div className="w-fit ml-4">
			<div>
				<label className="label">
					<span className="text-primary label-text">{t("auth.fields.email")}</span>
				</label>
				<input type="text" value={user.email} className="input input-bordered input-primary bg-neutral" />
			</div>
		</div>
	);
};

export default UserSettings;
