import { ReactNode } from "react";
import FontAwesomeIcon from "@/components/FontAwesomeIcon";

type AuthModalProps = {
	title: string;
	formChildren: ReactNode;
	otherAuthChildren: ReactNode;
	errorMessage?: string;
};
const AuthModal = ({ title, formChildren, otherAuthChildren, errorMessage }: AuthModalProps) => (
	<div className="modal-box bg-primary">
		<div className="relative flex flex-col items-center justify-center overflow-hidden">
			<div className="w-full p-6 rounded-md shadow-md lg:max-w-lg">
				<h1 className="text-3xl font-semibold text-center">{title}</h1>
				{errorMessage ? (
					<div className="alert alert-error my-4">
						<FontAwesomeIcon icon="circle-xmark" />
						<span>{errorMessage}</span>
					</div>
				) : (
					<></>
				)}
				<div className="space-y-4">{formChildren}</div>
				<div className="divider" />
				{otherAuthChildren}
			</div>
		</div>
	</div>
);

export default AuthModal;
