import { v4 as uuidv4 } from "uuid";

import { EditorWorkflow, EditorWorkflowAction, EditorWorkflowReaction } from "@/types/workflows";
import { AreaParameterWithValue } from "@/types/services";

export const getEmptyEditorAction = (id: string): EditorWorkflowAction => ({ id, parameters: {} });
export const getEmptyEditorReaction = (previousId: string): EditorWorkflowReaction => ({
	id: uuidv4(),
	parameters: {},
	previousAreaId: previousId,
});

export const getEmptyEditorWorkflow = (): EditorWorkflow => {
	const actionId = uuidv4();

	return {
		name: "Untitled workflow",
		action: getEmptyEditorAction(actionId),
		reactions: [getEmptyEditorReaction(actionId)],
		active: false,
	};
};

export const convertAreaParamsToWorkflowPayloadParams = (parameters: AreaParameterWithValue[]) => parameters.reduce((result: Record<string, any>, param) => {
		// eslint-disable-next-line no-param-reassign
		result[param.name] = param.value;
		return result;
	}, {});
