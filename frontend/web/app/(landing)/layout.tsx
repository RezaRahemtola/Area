import { ReactNode } from "react";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const LandingLayout = ({ children }: { children: ReactNode }) => (
	<>
		<Navbar />
		{children}
    <Footer />
	</>
);

export default LandingLayout;
