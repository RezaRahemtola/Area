"use client";

import { DetailedHTMLProps, InputHTMLAttributes } from "react";
import { useTranslation } from "react-i18next";

const AuthPasswordField = (props: DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>) => {
	const { t } = useTranslation();

	return (
		<div>
			<label className="label">
				<span className="text-base label-text">{t("auth.fields.email")}</span>
			</label>
			<input type="text" placeholder="john.doe@example.com" className="w-full input input-bordered" {...props} />
		</div>
	);
};
export default AuthPasswordField;
