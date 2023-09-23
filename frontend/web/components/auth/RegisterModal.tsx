import { forwardRef } from "react";

import AuthPasswordField from "@/components/auth/fields/AuthPasswordField";
import AuthEmailField from "@/components/auth/fields/AuthEmailField";

const RegisterModal = forwardRef<HTMLDialogElement>((props, ref) => (
	<dialog ref={ref} className="modal">
		<div className="modal-box bg-primary">
			<div className="relative flex flex-col items-center justify-center overflow-hidden">
				<div className="w-full p-6 rounded-md shadow-md lg:max-w-lg">
					<h1 className="text-3xl font-semibold text-center">Register</h1>
					<form className="space-y-4">
						<AuthEmailField />
						<AuthPasswordField />
						<AuthPasswordField placeholder="Enter password confirmation" label="Confirm password" />
						<div>
							<button className="btn btn-block btn-accent">Register</button>
						</div>
					</form>
					<div className="divider" />
					<p className="text-center">
						Already have an account? <a className="link">Login</a>
					</p>
				</div>
			</div>
		</div>
		<form method="dialog" className="modal-backdrop">
			<button>Close</button>
		</form>
	</dialog>
));

export default RegisterModal;
