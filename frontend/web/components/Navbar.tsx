import { ReactNode } from "react";
import Link from "next/link";

import ThemeSelector from "@/components/ThemeSelector";
import AuthLayout from "@/layouts/auth/AuthLayout";

type NavbarProps = {
	beforeLogoContent?: ReactNode;
	centerContent?: ReactNode;
};

const Navbar = ({ beforeLogoContent, centerContent }: NavbarProps) => (
	<div className="navbar bg-primary">
		<div className="navbar-start">
			{beforeLogoContent}
			<Link className="btn btn-ghost normal-case text-xl" href="/">
				Area
			</Link>
		</div>
		<div className="navbar-center hidden lg:flex">{centerContent}</div>
		<div className="navbar-end">
			<ThemeSelector />
			<AuthLayout />
		</div>
	</div>
);

export default Navbar;
