"use client";

import { ReactNode, useState } from "react";
import { useAtom } from "jotai";

import DashboardMenu from "@/components/dashboard/menu/DashboardMenu";
import DashboardNavbar from "@/components/dashboard/DashboardNavbar";
import { userAuthTokenAtom } from "@/stores/user";
import NotAuthenticatedLayout from "@/layouts/auth/NotAuthenticatedLayout";

const DashboardLayout = ({ children }: { children: ReactNode }) => {
	const [isDrawerOpen, setIsDrawerOpen] = useState(true);
	const [userAuthToken] = useAtom(userAuthTokenAtom);

	return (
		<>
			<DashboardNavbar isDrawerOpen={isDrawerOpen} setIsDrawerOpen={setIsDrawerOpen} />
			{userAuthToken ? (
				<div className="flex">
					<DashboardMenu isFull={isDrawerOpen} />
					{children}
				</div>
			) : (
				<NotAuthenticatedLayout />
			)}
		</>
	);
};

export default DashboardLayout;
