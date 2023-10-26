import { toast } from "react-toastify";

export const emitToastError = (message: string) =>
	toast.error(message, {
		position: "bottom-center",
		autoClose: 2000,
		hideProgressBar: false,
		closeOnClick: true,
		pauseOnHover: true,
		draggable: true,
		progress: undefined,
		theme: "colored",
	});
