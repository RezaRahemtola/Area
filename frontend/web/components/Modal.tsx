import { ReactNode } from "react";

type ModalProps = {
	title: string;
	children: ReactNode;
};
const Modal = ({ title, children }: ModalProps) => (
	<div className="modal-box bg-primary text-primary-content">
		<div className="relative flex flex-col items-center justify-center overflow-hidden">
			<div className="w-full p-6 rounded-md shadow-md lg:max-w-lg">
				<h1 className="text-3xl font-semibold text-center">{title}</h1>
				{children}
			</div>
		</div>
	</div>
);

export default Modal;
