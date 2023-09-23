import { ReactNode } from "react";
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
			<a className="btn btn-ghost normal-case text-xl">Area</a>
		</div>
		<div className="navbar-center hidden lg:flex">{centerContent}</div>
		<div className="navbar-end">
			<ThemeSelector />
			<AuthLayout />
		</div>
	</div>
);

export default Navbar;
