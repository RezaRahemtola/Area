import { nanoid } from "nanoid";

import { EditorElement, EditorWorkflow } from "@/types/workflows";

export const getEmptyArea = (): EditorElement => ({ id: nanoid(), account: false });

export const getEmptyWorkflow = (): EditorWorkflow => ({
	name: "Untitled workflow",
	action: getEmptyArea(),
	reactions: [getEmptyArea()],
});
