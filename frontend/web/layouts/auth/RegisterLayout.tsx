"use client";

import { useRef } from "react";
import RegisterModal from "@/components/auth/RegisterModal";

const RegisterLayout = () => {
	const modal = useRef<HTMLDialogElement>(null);

	return (
		<>
			<RegisterModal ref={modal} />
			<a className="btn btn-secondary mr-2" onClick={() => modal.current?.showModal()}>
				Register
			</a>
		</>
	);
};

export default RegisterLayout;
