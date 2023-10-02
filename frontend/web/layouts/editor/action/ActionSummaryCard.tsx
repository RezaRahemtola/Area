import { MouseEventHandler } from "react";
import EditorSummaryCard from "@/components/editor/EditorSummaryCard";

type ActionSummaryCardProps = {
	onClick: MouseEventHandler;
};
const ActionSummaryCard = ({ onClick }: ActionSummaryCardProps) => (
	<EditorSummaryCard title="Action" description="An event that starts your workflow" icon="bolt" onClick={onClick} />
);

export default ActionSummaryCard;
