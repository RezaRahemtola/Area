import { useTranslation } from "react-i18next";
import { useAtom } from "jotai";
import { DashboardMenuButton, DashboardMenuLink } from "@/components/dashboard/menu/DashboardMenuElements";
import { editorWorkflowAtom } from "@/stores/editor";
import { getEmptyEditorWorkflow } from "@/utils/workflows";

type DashboardMenuProps = {
	isFull: boolean;
};

const DashboardMenu = ({ isFull }: DashboardMenuProps) => {
	const { t } = useTranslation();
	const [, setEditorWorkflow] = useAtom(editorWorkflowAtom);

	return (
		<ul className={`menu sticky top-0 self-start bg-accent min-h-screen ${isFull ? "w-96" : "w-24"}`}>
			<li className="pb-5">
				<DashboardMenuButton
					icon="plus"
					title={t("dashboard.menu.editor")}
					href="/editor"
					isFull={isFull}
					onClick={() => setEditorWorkflow(getEmptyEditorWorkflow())}
				/>
			</li>
			<DashboardMenuLink
				icon="objects-column"
				title={t("dashboard.menu.dashboard")}
				href="/dashboard"
				isFull={isFull}
			/>
			<DashboardMenuLink icon="bolt" title={t("dashboard.menu.library")} href="/dashboard/library" isFull={isFull} />
			<DashboardMenuLink
				icon="grid-2-plus"
				title={t("dashboard.menu.services")}
				href="/dashboard/services"
				isFull={isFull}
			/>
		</ul>
	);
};
export default DashboardMenu;
