"use client";

import { useAtom } from "jotai";

import { editorWorkflowAtom } from "@/stores/editor";
import EditorSeparator from "@/components/editor/EditorSeparator";
import ActionCard from "@/components/editor/action/ActionCard";
import ReactionCard from "@/components/editor/reaction/ReactionCard";
import { EditorWorkflowReaction } from "@/types/workflows";

const EditorCards = () => {
	const [workflow] = useAtom(editorWorkflowAtom);

	const getSortedReactions = (
		reactions: EditorWorkflowReaction[],
		basePreviousId: string,
	): EditorWorkflowReaction[] => {
		const sortedReactions = [];
		let previousId = basePreviousId;

		for (let i = 0; i < reactions.length; i++) {
			const reaction = reactions.find((r) => r.previousAreaId === previousId);
			if (reaction === undefined) break;
			sortedReactions.push(reaction);
			previousId = reaction.id;
		}
		return sortedReactions;
	};

	return (
		<div>
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
