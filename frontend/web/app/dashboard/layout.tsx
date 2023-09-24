"use client";

import { ReactNode, useState } from "react";
import { useAtom } from "jotai";

import DashboardMenu from "@/components/dashboard/DashboardMenu";
import DashboardNavbar from "@/components/dashboard/DashboardNavbar";
import { userRegisteredAtom } from "@/stores/user";

const DashboardLayout = ({ children }: { children: ReactNode }) => {
	const [isDrawerOpen, setIsDrawerOpen] = useState(true);
	const [userRegistered] = useAtom(userRegisteredAtom);

	return (
		<>
			<DashboardNavbar isDrawerOpen={isDrawerOpen} setIsDrawerOpen={setIsDrawerOpen} />
			{userRegistered ? (
				<div className="flex">
					<DashboardMenu isFull={isDrawerOpen} />
					{children}
				</div>
			) : (
				<span>Please log in before using the app</span>
			)}
		</>
	);
};

export default DashboardLayout;
