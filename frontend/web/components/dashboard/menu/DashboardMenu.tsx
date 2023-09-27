import { DashboardMenuButton, DashboardMenuLink } from "@/components/dashboard/menu/DashboardMenuElements";

type DashboardMenuProps = {
	isFull: boolean;
};

const DashboardMenu = ({ isFull }: DashboardMenuProps) => (
	<ul className={`menu bg-accent h-screen overflow-y-auto ${isFull ? "w-96" : "w-24"}`}>
		<li className="pb-5">
			<DashboardMenuButton icon="plus" title="Create workflow" href="/app/editor" isFull={isFull} />
		</li>

		<DashboardMenuLink icon="bolt" title="Library" href="/app/library" isFull={isFull} />
		<DashboardMenuLink icon="grid-2-plus" title="Apps" href="/app/services" isFull={isFull} />

		{/* <li> */}
		{/*	<DashboardMenuLink */}
		{/*		svgLink={ */}
		{/*			"M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" */}
		{/*		} */}
		{/*		title="My Areas" */}
		{/*		href="/app/myAreas" */}
		{/*		isFull={isFull} */}
		{/*	/> */}
		{/* </li> */}
	</ul>
);

export default DashboardMenu;
