"use client";

import { useAtom } from "jotai";

import { editorWorkflowAtom } from "@/stores/editor";
import EditorSeparator from "@/components/editor/EditorSeparator";
import EditorCard from "@/layouts/editor/EditorCard";

const EditorCards = () => {
	const [workflow] = useAtom(editorWorkflowAtom);

	return (
		<div className="bg-neutral">
			<EditorCard area={workflow.action} isAction />
			<EditorSeparator index={0} />
			{workflow.reactions.map((reaction, index) => (
				<div key={reaction.id}>
					<EditorCard area={reaction} isAction={false} />
					<EditorSeparator index={index + 1} />
				</div>
			))}
		</div>
	);
};

export default EditorCards;
