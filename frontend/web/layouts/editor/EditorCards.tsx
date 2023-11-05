"use client";

import { useAtom } from "jotai";

import { editorWorkflowAtom } from "@/stores/editor";
import EditorSeparator from "@/components/editor/EditorSeparator";
import ActionCard from "@/components/editor/action/ActionCard";
import ReactionCard from "@/components/editor/reaction/ReactionCard";
import { getSortedReactions } from "@/utils/workflows";

const EditorCards = () => {
	const [workflow] = useAtom(editorWorkflowAtom);

	return (
		<div className="bg-neutral">
			<ActionCard />
			<EditorSeparator previousId={workflow.action.id} />
			{getSortedReactions(workflow.reactions, workflow.action.id).map((reaction) => (
				<div key={reaction.id}>
					<ReactionCard reaction={reaction} />
					<EditorSeparator previousId={reaction.id} />
				</div>
			))}
		</div>
	);
};

export default EditorCards;
