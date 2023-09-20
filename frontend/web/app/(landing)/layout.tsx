import { ReactNode } from "react";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

function LandingLayout({ children }: { children: ReactNode }) {
	return (
		<div className="flex flex-col h-screen justify-between">
			<Navbar />
			{children}
			<Footer />
		</div>
	);
}

export default LandingLayout;
