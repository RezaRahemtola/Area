import Link from "next/link";
import Navbar from "@/components/Navbar";

const LandingNavbar = () => (
	<Navbar
		centerContent={
			<ul className="menu menu-horizontal px-1">
				<li>
					<Link href="/features">Features</Link>
				</li>
				<li>
					<Link href="/pricing">Pricing</Link>
				</li>
				<li>
					<Link href="/documentation">Documentation</Link>
				</li>
				<li>
					<Link href="/team">Team</Link>
				</li>
			</ul>
		}
	/>
);

export default LandingNavbar;
