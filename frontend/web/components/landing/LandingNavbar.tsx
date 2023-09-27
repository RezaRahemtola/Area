import Navbar from "@/components/Navbar";

const LandingNavbar = () => (
	<Navbar
		centerContent={
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
		}
	/>
);

export default LandingNavbar;
