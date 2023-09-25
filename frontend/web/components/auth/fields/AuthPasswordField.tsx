import { HTMLAttributes } from "react";

type AuthPasswordFieldProps = HTMLAttributes<HTMLInputElement> & {
	label?: string;
};

const AuthPasswordField = ({ label, ...props }: AuthPasswordFieldProps) => (
	<div>
		<label className="label">
			<span className="text-base label-text">{label ?? "Password"}</span>
		</label>
		<input type="password" placeholder="Enter password" className="w-full input input-bordered" {...props} />
	</div>
);

export default AuthPasswordField;
