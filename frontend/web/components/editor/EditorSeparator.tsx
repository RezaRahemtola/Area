import { useAtom } from "jotai";
import FontAwesomeIcon from "@/components/FontAwesomeIcon";
import { editorWorkflowAtom } from "@/stores/editor";
import { getEmptyEditorReaction } from "@/utils/workflows";

const EditorSeparator = ({ previousId }: { previousId: string }) => {
	const [editorWorkflow, setEditorWorkflow] = useAtom(editorWorkflowAtom);
	const onClick = () => {
		const newReaction = getEmptyEditorReaction(previousId);
		let oldPreviousId = previousId;
		const newPreviousId = newReaction.id;
		const newReactions = structuredClone(editorWorkflow.reactions);

		let matchingReaction = newReactions.find((r) => r.previousAreaId === oldPreviousId);
		while (matchingReaction) {
			oldPreviousId = matchingReaction.id;
			matchingReaction.previousAreaId = newPreviousId;
			matchingReaction = newReactions.find((r) => r.previousAreaId === oldPreviousId);
		}
		newReactions.push(newReaction);

		setEditorWorkflow((prev) => ({ ...prev, reactions: newReactions }));
	};

	return (
		<>
			<div className="flex w-full justify-center">
				<div className="min-h-12 w-0.5 bg-secondary opacity-100 dark:opacity-50"></div>
			</div>

			<div className="flex w-full justify-center">
				<button className="btn btn-circle btn-sm" onClick={onClick}>
					<FontAwesomeIcon icon="plus" svgProps={{ className: "h-6 w-6" }} />
				</button>
			</div>

			<div className="flex w-full justify-center">
				<div className="min-h-12 w-0.5 bg-secondary opacity-100 dark:opacity-50"></div>
			</div>
		</>
	);
};

export default EditorSeparator;
