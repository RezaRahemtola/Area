import { ReactNode } from "react";

type AuthModalProps = {
	title: string;
	formChildren: ReactNode;
	otherAuthChildren: ReactNode;
};
const AuthModal = ({ title, formChildren, otherAuthChildren }: AuthModalProps) => (
	<div className="modal-box bg-primary">
		<div className="relative flex flex-col items-center justify-center overflow-hidden">
			<div className="w-full p-6 rounded-md shadow-md lg:max-w-lg">
				<h1 className="text-3xl font-semibold text-center">{title}</h1>
				<form className="space-y-4">{formChildren}</form>
				<div className="divider" />
				{otherAuthChildren}
			</div>
		</div>
	</div>
);

export default AuthModal;
