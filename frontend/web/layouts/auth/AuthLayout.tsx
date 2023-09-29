"use client";

import { useRef } from "react";
import Image from "next/image";
import { useAtom } from "jotai";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";

import LoginModal from "@/components/auth/modals/LoginModal";
import RegisterModal from "@/components/auth/modals/RegisterModal";
import { userAuthTokenAtom } from "@/stores/user";
import FontAwesomeIcon from "@/components/FontAwesomeIcon";

const AuthLayout = () => {
	const loginModalRef = useRef<HTMLDialogElement>(null);
	const registerModalRef = useRef<HTMLDialogElement>(null);
	const [userAuthToken, setUserAuthToken] = useAtom(userAuthTokenAtom);

	const router = useRouter();
	const pathname = usePathname();

	const switchAuthToRegister = () => {
		loginModalRef.current?.close();
		registerModalRef.current?.showModal();
	};

	const switchAuthToLogin = () => {
		registerModalRef.current?.close();
		loginModalRef.current?.showModal();
	};

	const onAuthSuccess = (accessToken: string) => {
		setUserAuthToken(accessToken);
		if (!pathname.startsWith("/dashboard")) {
			router.push("/dashboard");
		}
	};

	const onLogout = () => {
		setUserAuthToken(null);
	};

	return (
		<>
			{userAuthToken ? (
				<div className="dropdown dropdown-end">
					<label tabIndex={0} className="btn btn-ghost btn-circle avatar">
						<div className="w-10 rounded-full">
							<Image alt="Profile picture" width="100" height="100" src="/user/default-profile-picture.webp" />
						</div>
					</label>
					<ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
						<li>
							<Link href="/dashboard/user">
								<FontAwesomeIcon icon="gear" />
								Settings
							</Link>
						</li>
						<li>
							<a onClick={onLogout}>
								<FontAwesomeIcon icon="arrow-right-from-bracket" />
								Logout
							</a>
						</li>
					</ul>
				</div>
			) : (
				<>
					<LoginModal ref={loginModalRef} onAuthTypeChange={switchAuthToRegister} onAuthSuccess={onAuthSuccess} />
					<a className="btn btn-ghost mr-2" onClick={switchAuthToLogin}>
						Login
					</a>
					<RegisterModal ref={registerModalRef} onAuthTypeChange={switchAuthToLogin} onAuthSuccess={onAuthSuccess} />
					<a className="btn btn-secondary mr-2" onClick={switchAuthToRegister}>
						Register
					</a>
				</>
			)}
		</>
	);
};

export default AuthLayout;
