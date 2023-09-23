import ThemeSelector from "@/components/ThemeSelector";
import LoginLayout from "@/layouts/auth/LoginLayout";
import RegisterLayout from "@/layouts/auth/RegisterLayout";

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
			<LoginLayout />
			<RegisterLayout />
		</div>
	</div>
);

export default Navbar;
