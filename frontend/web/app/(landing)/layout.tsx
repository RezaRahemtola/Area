import { ReactNode } from "react";

import Navbar from "@/components/Navbar";

const LandingLayout = ({ children }: { children: ReactNode }) => (
	<>
		<Navbar />
		{children}
	</>
);

export default LandingLayout;
