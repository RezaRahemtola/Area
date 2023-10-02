import { MouseEventHandler } from "react";
import EditorSummaryCard from "@/components/editor/EditorSummaryCard";
import { EditorElement } from "@/types/workflows";

type ActionSummaryCardProps = {
	onClick: MouseEventHandler;
	action?: EditorElement;
};
const ActionSummaryCard = ({ onClick, action }: ActionSummaryCardProps) => (
	<EditorSummaryCard
		title="Action"
		description={action?.event ? action.event.name : "An event that starts your workflow"}
		icon="bolt"
		onClick={onClick}
		service={action?.service}
	/>
);

export default ActionSummaryCard;
