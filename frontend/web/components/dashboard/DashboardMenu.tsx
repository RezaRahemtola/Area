import DashboardMenuLink from "@/components/dashboard/DashboardMenuLink";

const DashboardMenu = ({ isFull }: { isFull: boolean }) => (
	<ul className={`menu bg-accent h-screen overflow-y-auto${  isFull ? " w-64" : " w-16"}`}>
		<li>
			<DashboardMenuLink
				svgLink={"M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"}
				title={"Home"}
				href={"/dashboard"}
				isFull={isFull}
			/>
		</li>
		<li>
			<DashboardMenuLink
				svgLink={"M13 10V3L4 14h7v7l9-11h-7z"}
				title={"My Areas"}
				href={"/dashboard"}
				isFull={isFull}
			/>
		</li>
		<li>
			<DashboardMenuLink
				svgLink={"M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"}
				title={"Stats"}
				href={"/dashboard"}
				isFull={isFull}
			/>
		</li>
	</ul>
);

export default DashboardMenu;
