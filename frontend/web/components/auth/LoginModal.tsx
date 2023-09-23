import { forwardRef } from "react";

import AuthPasswordField from "@/components/auth/fields/AuthPasswordField";
import AuthEmailField from "@/components/auth/fields/AuthEmailField";

const LoginModal = forwardRef<HTMLDialogElement>((props, ref) => (
	<dialog ref={ref} className="modal">
		<div className="modal-box bg-primary">
			<div className="relative flex flex-col items-center justify-center overflow-hidden">
				<div className="w-full p-6 rounded-md shadow-md lg:max-w-lg">
					<h1 className="text-3xl font-semibold text-center">Login</h1>
					<form className="space-y-4">
						<AuthEmailField />
						<AuthPasswordField placeholder="Enter Password" />
						<div>
							<button className="btn btn-block btn-accent">Login</button>
						</div>
					</form>
					<div className="divider" />
					<p className="text-center">
						Don't have an account yet? <a className="link">Create one</a>
					</p>
				</div>
			</div>
		</div>
		<form method="dialog" className="modal-backdrop">
			<button>Close</button>
		</form>
	</dialog>
));

export default LoginModal;
