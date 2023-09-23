import { forwardRef } from "react";

import AuthPasswordField from "@/components/auth/fields/AuthPasswordField";
import AuthEmailField from "@/components/auth/fields/AuthEmailField";
import AuthModal from "@/components/auth/modals/AuthModal";

const LoginModal = forwardRef<HTMLDialogElement>((props, ref) => (
	<dialog ref={ref} className="modal">
		<AuthModal
			title="Login"
			formChildren={
				<>
					<AuthEmailField />
					<AuthPasswordField placeholder="Enter Password" />
					<div>
						<button className="btn btn-block btn-accent">Login</button>
					</div>
				</>
			}
			otherAuthChildren={
				<p className="text-center">
					Don't have an account yet? <a className="link">Create one</a>
				</p>
			}
		/>
		<form method="dialog" className="modal-backdrop">
			<button>Close</button>
		</form>
	</dialog>
));

export default LoginModal;
