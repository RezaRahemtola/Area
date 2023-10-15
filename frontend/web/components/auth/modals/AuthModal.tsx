import { forwardRef, ReactNode } from "react";
import { useTranslation } from "react-i18next";
import FontAwesomeIcon from "@/components/FontAwesomeIcon";
import Modal from "@/components/Modal";

type AuthModalProps = {
	title: string;
	formChildren: ReactNode;
	errorMessage?: string;
	onClose: () => void;
	switchMethodCtaText: string;
	switchMethodActionText: string;
	onAuthTypeChange: () => void;
};

const AuthModal = forwardRef<HTMLDialogElement, AuthModalProps>(
	(
		{ title, formChildren, errorMessage, onClose, switchMethodCtaText, switchMethodActionText, onAuthTypeChange },
		ref,
	) => {
		const { t } = useTranslation();

		return (
			<dialog ref={ref} className="modal">
				<Modal title={title}>
					<>
						{errorMessage && (
							<div className="alert alert-error my-4 whitespace-pre-line" data-cy="auth-error-message">
								<FontAwesomeIcon icon="circle-xmark" />
								<span>{errorMessage}</span>
							</div>
						)}
						<div className="space-y-4">{formChildren}</div>
						<div className="divider" />
						<p className="text-center">
							{switchMethodCtaText}
							<a className="link" onClick={onAuthTypeChange}>
								{switchMethodActionText}
							</a>
						</p>
					</>
				</Modal>
				<form method="dialog" className="modal-backdrop">
					<button onClick={onClose}>{t("actions.close")}</button>
				</form>
			</dialog>
		);
	},
);
export default AuthModal;
