import { ReactNode } from "react";
import FontAwesomeIcon from "@/components/FontAwesomeIcon";
import Modal from "@/components/Modal";

type AuthModalProps = {
	title: string;
	formChildren: ReactNode;
	otherAuthChildren: ReactNode;
	errorMessage?: string;
};
const AuthModal = ({ title, formChildren, otherAuthChildren, errorMessage }: AuthModalProps) => (
	<Modal title={title}>
		<>
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
		</>
	</Modal>
);

export default AuthModal;
