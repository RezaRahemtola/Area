import { MouseEventHandler } from "react";
import EditorSummaryCard from "@/components/editor/EditorSummaryCard";
import { Service } from "@/types/services";

type ActionSummaryCardProps = {
	onClick: MouseEventHandler;
	service?: Service;
};
const ActionSummaryCard = ({ onClick, service }: ActionSummaryCardProps) => (
	<EditorSummaryCard
		title="Action"
		description="An event that starts your workflow"
		icon="bolt"
		onClick={onClick}
		service={service}
	/>
);

export default ActionSummaryCard;
