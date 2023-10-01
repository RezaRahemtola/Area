import DashboardPageWrapper from "@/layouts/dashboard/DashboardPageWrapper";
import EditorSeparator from "@/components/editor/EditorSeparator";
import ActionCard from "@/layouts/editor/ActionCard";
import ReactionCard from "@/layouts/editor/ReactionCard";

const EditorPage = () => (
	<DashboardPageWrapper title="Workflow editor">
		<ActionCard />
		<EditorSeparator />
		<ReactionCard />
		<EditorSeparator />
	</DashboardPageWrapper>
);

export default EditorPage;
