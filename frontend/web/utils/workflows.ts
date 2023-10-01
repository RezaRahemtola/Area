import { EditorWorkflow } from "@/types/workflows";

// eslint-disable-next-line import/prefer-default-export
export const getEmptyWorkflow = (): EditorWorkflow => ({
	name: "Untitled workflow",
	action: undefined,
	reactions: [undefined],
});
