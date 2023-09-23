import ThemeSelector from "@/components/ThemeSelector";
import AuthLayout from "@/layouts/auth/AuthLayout";

const Navbar = () => (
	<div className="navbar bg-primary">
		<div className="navbar-start">
			<a className="btn btn-ghost normal-case text-xl">Area</a>
		</div>
		<div className="navbar-center hidden lg:flex">
			<ul className="menu menu-horizontal px-1">
				<li>
					<a>Features</a>
				</li>
				<li>
					<a>Pricing</a>
				</li>
				<li>
					<a>Documentation</a>
				</li>
				<li>
					<a>Team</a>
				</li>
			</ul>
		</div>
		<div className="navbar-end">
			<ThemeSelector />
			<AuthLayout />
		</div>
	</div>
);

export default Navbar;
