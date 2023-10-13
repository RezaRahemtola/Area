"use client";

import { ReactNode } from "react";

import "@/config/i18n";
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
