import { forwardRef, useState } from "react";

import AuthPasswordField from "@/components/auth/fields/AuthPasswordField";
import AuthEmailField from "@/components/auth/fields/AuthEmailField";
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
		<dialog ref={ref} className="modal">
			<AuthModal
				title="Login"
				errorMessage={errorMessage}
				formChildren={
					<>
						<AuthEmailField value={email} onChange={(e) => setEmail(e.target.value)} />
						<AuthPasswordField value={password} onChange={(e) => setPassword(e.target.value)} />
						<div>
							<button className="btn btn-block btn-accent" onClick={onLogin}>
								Login
							</button>
						</div>
					</>
				}
				otherAuthChildren={
					<p className="text-center">
						Don't have an account yet?{" "}
						<a className="link" onClick={onAuthTypeChange}>
							Create one
						</a>
					</p>
				}
			/>
			<form method="dialog" className="modal-backdrop">
				<button onClick={onClose}>Close</button>
			</form>
		</dialog>
	);
});

export default LoginModal;
