"use client";

import { ReactNode, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

import { useAtom } from "jotai";
import ThemeSelector from "@/components/ThemeSelector";
import AuthLayout from "@/layouts/auth/AuthLayout";
import { interfaceLanguageAtom } from "@/stores/user";
import i18n from "@/config/i18n";

type NavbarProps = {
	beforeLogoContent?: ReactNode;
	hasLogo?: boolean;
	centerContent?: ReactNode;
	endContent?: ReactNode;
};

const Navbar = ({ beforeLogoContent, hasLogo = true, centerContent, endContent }: NavbarProps) => {
	const [interfaceLanguage] = useAtom(interfaceLanguageAtom);

	useEffect(() => {
		i18n.changeLanguage(interfaceLanguage).then();
	}, [interfaceLanguage]);

	return (
		<div className="navbar bg-primary">
			<div className="navbar-start">
				{beforeLogoContent}
				{hasLogo ? (
					<Link className="btn btn-ghost normal-case text-xl" href="/">
						<Image src="/logo.png" alt="Area logo" width={42} height={42} />
						Area
					</Link>
				) : (
					<></>
				)}
			</div>
			<div className="navbar-center hidden lg:flex">{centerContent}</div>
			<div className="navbar-end">
				{endContent ?? (
					<>
						<ThemeSelector />
						<AuthLayout />
					</>
				)}
			</div>
		</div>
	);
};

export default Navbar;
