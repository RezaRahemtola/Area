import { ReactNode } from "react";

import Footer from "@/components/Footer";
import LandingNavbar from "@/components/landing/LandingNavbar";

const LandingLayout = ({ children }: { children: ReactNode }) => (
	<>
		<LandingNavbar />
		{children}
		<Footer />
	</>
);

export default LandingLayout;
