import { ReactNode } from "react";
import Link from "next/link";

import ThemeSelector from "@/components/ThemeSelector";
import AuthLayout from "@/layouts/auth/AuthLayout";

type NavbarProps = {
	beforeLogoContent?: ReactNode;
	hasLogo?: boolean;
	centerContent?: ReactNode;
	endContent?: ReactNode;
};

const Navbar = ({ beforeLogoContent, hasLogo = true, centerContent, endContent }: NavbarProps) => (
	<div className="navbar bg-primary">
		<div className="navbar-start">
			{beforeLogoContent}
			{hasLogo ? (
				<Link className="btn btn-ghost normal-case text-xl" href="/">
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

export default Navbar;
