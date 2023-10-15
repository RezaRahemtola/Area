import { DetailedHTMLProps, InputHTMLAttributes } from "react";
import { useTranslation } from "react-i18next";

type AuthPasswordFieldProps = DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> & {
	label?: string;
};

const AuthPasswordField = ({ label, ...props }: AuthPasswordFieldProps) => {
	const { t } = useTranslation();

	return (
		<div>
			<label className="label">
				<span className="text-base label-text">{label ?? t("auth.fields.password")}</span>
			</label>
			<input
				type="password"
				placeholder={t("auth.fields.passwordPlaceholder")}
				className="w-full input input-bordered pointer-events-auto"
				{...props}
			/>
		</div>
	);
};
export default AuthPasswordField;
