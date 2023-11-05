import { useAtom } from "jotai";
import FontAwesomeIcon from "@/components/FontAwesomeIcon";
import { editorWorkflowAtom } from "@/stores/editor";
import { getEmptyEditorReaction } from "@/utils/workflows";

const EditorSeparator = ({ previousId }: { previousId: string }) => {
	const [, setEditorWorkflow] = useAtom(editorWorkflowAtom);
	const onClick = () => {
		const newReaction = getEmptyEditorReaction(previousId);

		setEditorWorkflow((prev) => ({
			...prev,
			reactions: [
				...prev.reactions.map((r) => {
					if (r.previousAreaId === previousId) {
						return { ...r, previousAreaId: newReaction.id };
					}
					return r;
				}),
				newReaction,
			],
		}));
	};

	return (
		<>
			<div className="flex w-full justify-center">
				<div className="min-h-12 w-0.5 bg-secondary opacity-100 dark:opacity-50"></div>
			</div>

			<div className="flex w-full justify-center">
				<button className="btn btn-circle btn-sm bg-accent border-accent" onClick={onClick}>
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
