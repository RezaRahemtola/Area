"use client";

import { useRef } from "react";
import LoginModal from "@/components/auth/LoginModal";

const LoginLayout = () => {
	const modal = useRef<HTMLDialogElement>(null);

	return (
		<>
			<LoginModal ref={modal} />
			<a className="btn btn-ghost mx-2" onClick={() => modal.current?.showModal()}>
				Login
			</a>
		</>
	);
};

export default LoginLayout;
