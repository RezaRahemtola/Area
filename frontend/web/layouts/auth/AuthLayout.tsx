"use client";

import { useRef } from "react";

import Image from "next/image";
import LoginModal from "@/components/auth/modals/LoginModal";
import RegisterModal from "@/components/auth/modals/RegisterModal";

const AuthLayout = () => {
	const loginModalRef = useRef<HTMLDialogElement>(null);
	const registerModalRef = useRef<HTMLDialogElement>(null);

	const switchAuthToRegister = () => {
		loginModalRef.current?.close();
		registerModalRef.current?.showModal();
	};

	const switchAuthToLogin = () => {
		registerModalRef.current?.close();
		loginModalRef.current?.showModal();
	};

	return (
		<>
			<LoginModal ref={loginModalRef} onAuthTypeChange={switchAuthToRegister} />
			<a className="btn btn-ghost mx-2" onClick={switchAuthToLogin}>
				Login
			</a>

			<RegisterModal ref={registerModalRef} onAuthTypeChange={switchAuthToLogin} />
			<a className="btn btn-secondary mr-2" onClick={switchAuthToRegister}>
				Register
			</a>

			<div className="dropdown dropdown-end">
				<label tabIndex={0} className="btn btn-ghost btn-circle avatar">
					<div className="w-10 rounded-full">
						<Image alt="Profile picture" width="100" height="100" src="/user/default-profile-picture.webp" />
					</div>
				</label>
			</div>
		</>
	);
};

export default AuthLayout;
