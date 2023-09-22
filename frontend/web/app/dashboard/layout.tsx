"use client";

import { ReactNode, useState } from "react";

import DashboardMenu from "@/components/dashboard/DashboardMenu";
import DashboardNavbar from "@/components/dashboard/DashboardNavbar";

const DashboardLayout = ({ children }: { children: ReactNode }) => {
	const [isDrawerOpen, setIsDrawerOpen] = useState(true);

	return (
		<>
			<DashboardNavbar isDrawerOpen={isDrawerOpen} setIsDrawerOpen={setIsDrawerOpen} />
			<div className="flex">
				<DashboardMenu isFull={isDrawerOpen} />
				{children}
			</div>
		</>
	);
};

export default DashboardLayout;
