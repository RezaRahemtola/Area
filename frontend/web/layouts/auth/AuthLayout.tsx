"use client";

import { useRef } from "react";

import Image from "next/image";
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
