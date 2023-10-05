import { DashboardMenuButton, DashboardMenuLink } from "@/components/dashboard/menu/DashboardMenuElements";

type DashboardMenuProps = {
	isFull: boolean;
};

const DashboardMenu = ({ isFull }: DashboardMenuProps) => (
	<ul className={`menu sticky top-0 self-start bg-accent min-h-screen overflow-y-auto ${isFull ? "w-96" : "w-24"}`}>
		<li className="pb-5">
			<DashboardMenuButton icon="plus" title="Create workflow" href="/editor" isFull={isFull} />
		</li>
		<DashboardMenuLink icon="objects-column" title="Dashboard" href="/dashboard" isFull={isFull} />
		<DashboardMenuLink icon="bolt" title="Library" href="/dashboard/library" isFull={isFull} />
		<DashboardMenuLink icon="grid-2-plus" title="Apps" href="/dashboard/services" isFull={isFull} />
	</ul>
);

export default DashboardMenu;
