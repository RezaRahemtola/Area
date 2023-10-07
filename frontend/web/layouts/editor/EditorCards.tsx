"use client";

import { useAtom } from "jotai";

import { editorWorkflowAtom } from "@/stores/editor";
import EditorSeparator from "@/components/editor/EditorSeparator";
import ActionCard from "@/components/editor/action/ActionCard";
import ReactionCard from "@/components/editor/reaction/ReactionCard";

const EditorCards = () => {
	const [workflow] = useAtom(editorWorkflowAtom);

	return (
		<div className="bg-neutral">
			<ActionCard />
			<EditorSeparator index={0} />
			{workflow.reactions.map((reaction, index) => (
				<div key={reaction.id}>
					<ReactionCard reaction={reaction} />
					<EditorSeparator index={index + 1} />
				</div>
			))}
		</div>
	);
};

export default EditorCards;
