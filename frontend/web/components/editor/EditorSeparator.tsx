"use client";

import FontAwesomeIcon from "@/components/FontAwesomeIcon";

const EditorSeparator = ({ index }: { index: number }) => {
	const onClick = () => 
		// TODO Reza: update this
		 index
		// setEditorWorkflow((prev) => ({ ...prev, reactions: prev.reactions.toSpliced(index, 0, getEmptyArea()) }));
	;

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
