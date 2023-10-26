import { toast, ToastOptions } from "react-toastify";

const toastConfig: ToastOptions = {
	position: "bottom-center",
	autoClose: 2000,
	hideProgressBar: false,
	closeOnClick: true,
	pauseOnHover: true,
	draggable: true,
	progress: undefined,
	theme: "colored",
};

export const emitToastError = (message: string) => toast.error(message, toastConfig);
export const emitToastSuccess = (message: string) => toast.success(message, toastConfig);
