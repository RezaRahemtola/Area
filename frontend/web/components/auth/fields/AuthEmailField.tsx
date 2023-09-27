import { DetailedHTMLProps, InputHTMLAttributes } from "react";

const AuthPasswordField = (props: DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>) => (
	<div>
		<label className="label">
			<span className="text-base label-text">Email</span>
		</label>
		<input type="text" placeholder="john.doe@example.com" className="w-full input input-bordered" {...props} />
	</div>
);

export default AuthPasswordField;
