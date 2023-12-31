import { forwardRef, MouseEvent, useState } from "react";

import { useTranslation } from "react-i18next";
import AuthPasswordField from "@/components/auth/fields/AuthPasswordField";
import AuthEmailField from "@/components/auth/fields/AuthEmailField";
import AuthModal from "@/components/auth/modals/AuthModal";
import services from "@/services";

type RegisterModalProps = {
	onAuthTypeChange: () => void;
	onAuthSuccess: (accessToken: string) => void;
};

const RegisterModal = forwardRef<HTMLDialogElement, RegisterModalProps>(({ onAuthTypeChange, onAuthSuccess }, ref) => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [passwordConfirmation, setPasswordConfirmation] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const { t } = useTranslation();

	const onRegister = async (e: MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		if (password !== passwordConfirmation) {
			setErrorMessage(t("auth.register.errors.passwordsNotMatching"));
			return;
		}
		const { data: accessToken, error } = await services.auth.register({ email, password });
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
			title={t("auth.register.title")}
			errorMessage={errorMessage}
			ref={ref}
			formChildren={
				<>
					<AuthEmailField value={email} onChange={(e) => setEmail(e.target.value)} data-cy="register-email-input" />
					<AuthPasswordField
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						data-cy="register-password-input"
					/>
					<AuthPasswordField
						value={passwordConfirmation}
						onChange={(e) => setPasswordConfirmation(e.target.value)}
						placeholder="Enter password confirmation"
						label="Confirm password"
						data-cy="register-confirm-password-input"
					/>
					<div>
						<button
							type="submit"
							className="btn btn-block btn-accent "
							onClick={onRegister}
							data-cy="register-action-btn"
						>
							{t("auth.register.action")}
						</button>
					</div>
				</>
			}
			switchMethodCtaText={t("auth.register.switchMethodCta")}
			switchMethodActionText={t("auth.register.switchMethodAction")}
			onAuthTypeChange={onAuthTypeChange}
			onClose={onClose}
		/>
	);
});

export default RegisterModal;
