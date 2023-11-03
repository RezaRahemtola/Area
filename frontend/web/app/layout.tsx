import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ToastContainer } from "react-toastify";

import { ReactNode } from "react";

import "@/styles/globals.css";
import "react-toastify/dist/ReactToastify.css";

/* istanbul ignore next */
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Area",
	description: "Create, Automate, Succeed!",
};

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html lang="en">
			<body className={inter.className}>
				{children}
				<ToastContainer />
			</body>
		</html>
	);
}
