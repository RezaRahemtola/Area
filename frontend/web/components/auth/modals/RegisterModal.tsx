import { forwardRef } from "react";

import AuthPasswordField from "@/components/auth/fields/AuthPasswordField";
import AuthEmailField from "@/components/auth/fields/AuthEmailField";
import AuthModal from "@/components/auth/modals/AuthModal";

type RegisterModalProps = {
	onAuthTypeChange: () => void;
};

const RegisterModal = forwardRef<HTMLDialogElement, RegisterModalProps>(({ onAuthTypeChange }, ref) => (
	<dialog ref={ref} className="modal">
		<AuthModal
			title="Register"
			formChildren={
				<>
					<AuthEmailField />
					<AuthPasswordField />
					<AuthPasswordField placeholder="Enter password confirmation" label="Confirm password" />
					<div>
						<button className="btn btn-block btn-accent">Register</button>
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
			<button>Close</button>
		</form>
	</dialog>
));

export default RegisterModal;
