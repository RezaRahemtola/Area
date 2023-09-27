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
	</ul>
);

export default DashboardMenu;
