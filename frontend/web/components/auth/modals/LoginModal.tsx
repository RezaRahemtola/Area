import { forwardRef, useState } from "react";

import { useTranslation } from "react-i18next";
import AuthEmailField from "@/components/auth/fields/AuthEmailField";
import AuthPasswordField from "@/components/auth/fields/AuthPasswordField";
import AuthModal from "@/components/auth/modals/AuthModal";
import services from "@/services";

type LoginModalProps = {
	onAuthTypeChange: () => void;
	onAuthSuccess: (accessToken: string) => void;
};

const LoginModal = forwardRef<HTMLDialogElement, LoginModalProps>(({ onAuthTypeChange, onAuthSuccess }, ref) => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const { t } = useTranslation();

	const onLogin = async () => {
		const { data: accessToken, error } = await services.auth.login({ email, password });
		if (accessToken !== null) {
			onAuthSuccess(accessToken);
		} else {
			setErrorMessage(error);
		}
	};

	const onClose = () => {
		setErrorMessage("");
	};

	return (
		<AuthModal
			title={t("auth.login.title")}
			errorMessage={errorMessage}
			ref={ref}
			formChildren={
				<>
					<AuthEmailField value={email} onChange={(e) => setEmail(e.target.value)} data-cy="login-email-input" />
					<AuthPasswordField
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						data-cy="login-password-input"
					/>
					<div>
						<button className="btn btn-block btn-accent" onClick={onLogin} data-cy="login-action-btn">
							{t("auth.login.action")}
						</button>
					</div>
				</>
			}
			switchMethodCtaText={t("auth.login.switchMethodCta")}
			switchMethodActionText={t("auth.login.switchMethodAction")}
			onAuthTypeChange={onAuthTypeChange}
			onClose={onClose}
		/>
	);
});

export default LoginModal;
