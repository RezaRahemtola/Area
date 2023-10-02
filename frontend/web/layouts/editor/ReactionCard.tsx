"use client";

import { useAtom } from "jotai";

import { EditorElement } from "@/types/workflows";
import { selectedEditorAreaAtom } from "@/stores/editor";
import EditorSummaryCard from "@/components/editor/EditorSummaryCard";

const ReactionCard = ({ reaction }: { reaction: EditorElement }) => {
	const [, setSelectedArea] = useAtom(selectedEditorAreaAtom);

	return (
		<EditorSummaryCard
			title="Reaction"
			description="An event a workflow performs after it start"
			icon="bolt"
			onClick={() => setSelectedArea(reaction.id)}
		/>
	);
};

export default ReactionCard;
