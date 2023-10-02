"use client";

import { useAtom } from "jotai";

import { editorWorkflowAtom } from "@/stores/editor";
import ActionCard from "@/layouts/editor/action/ActionCard";
import EditorSeparator from "@/components/editor/EditorSeparator";
import ReactionCard from "@/layouts/editor/ReactionCard";

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
