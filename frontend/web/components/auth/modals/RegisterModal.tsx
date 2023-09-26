import { forwardRef, useState } from "react";

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
	const [errorMessage, setErrorMessage] = useState("");

	const onRegister = async () => {
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
		<dialog ref={ref} className="modal">
			<AuthModal
				title="Register"
				errorMessage={errorMessage}
				formChildren={
					<>
						<AuthEmailField value={email} onChange={(e) => setEmail(e.target.value)} />
						<AuthPasswordField value={password} onChange={(e) => setPassword(e.target.value)} />
						<AuthPasswordField placeholder="Enter password confirmation" label="Confirm password" />
						<div>
							<button className="btn btn-block btn-accent" onClick={onRegister}>
								Register
							</button>
						</div>
					</>
				}
				otherAuthChildren={
					<p className="text-center">
						Already have an account?{" "}
						<a className="link" onClick={onAuthTypeChange}>
							Login
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

export default RegisterModal;
