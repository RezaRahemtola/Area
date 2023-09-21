"use client";

import { useState } from "react";
import DashboardMenuSmall from "@/components/dashboard/menu/DashboardMenuSmall";

const DashboardPage = () => {
	const [isDrawerOpen, setIsDrawerOpen] = useState(true);

	return (
		<>
			<div className="navbar bg-primary">
				<div className="navbar-start">
					<div className="flex-none">
						<button className="btn btn-square btn-ghost" onClick={() => setIsDrawerOpen((prev) => !prev)}>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								className="inline-block w-5 h-5 stroke-current"
							>
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
							</svg>
						</button>
					</div>
					<a className="btn btn-ghost normal-case text-xl">Area</a>
				</div>
				<div className="navbar-end">
					<div className="dropdown dropdown-end">
						<label tabIndex={0} className="btn btn-ghost btn-circle avatar">
							<div className="w-10 rounded-full">
								<img src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png" />
							</div>
						</label>
					</div>
				</div>
			</div>

			<div className="drawer block">
				<input id="my-drawer" type="checkbox" checked={isDrawerOpen} className="drawer-toggle" />
				<div className="drawer-content absolute">
					{/* Page content here */}
					<DashboardMenuSmall />
				</div>
				<div className="drawer-side relative">
					<ul className="menu p-4 w-80 min-h-full bg-accent text-base-content">
						{/* Sidebar content here */}
						<li>
							<a>Sidebar Item 1</a>
						</li>
						<li>
							<a>Sidebar Item 2</a>
						</li>
					</ul>
				</div>
			</div>
		</>
	);
};

export default DashboardPage;
