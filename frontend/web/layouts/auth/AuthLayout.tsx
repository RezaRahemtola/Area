"use client";

import { useRef } from "react";

import LoginModal from "@/components/auth/modals/LoginModal";
import RegisterModal from "@/components/auth/modals/RegisterModal";

const AuthLayout = () => {
	const loginModalRef = useRef<HTMLDialogElement>(null);
	const registerModalRef = useRef<HTMLDialogElement>(null);

	return (
		<>
			<LoginModal ref={loginModalRef} />
			<a className="btn btn-ghost mx-2" onClick={() => loginModalRef.current?.showModal()}>
				Login
			</a>

			<RegisterModal ref={registerModalRef} />
			<a className="btn btn-secondary mr-2" onClick={() => registerModalRef.current?.showModal()}>
				Register
			</a>
		</>
	);
};

export default AuthLayout;
