import { v4 as uuidv4 } from "uuid";

import { EditorWorkflow, EditorWorkflowAction, EditorWorkflowReaction, Workflow } from "@/types/workflows";
import { AreaParameterWithValue } from "@/types/services";
import services from "@/services";

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

export const convertAreaParamsToWorkflowPayloadParams = (parameters: AreaParameterWithValue[]) =>
	parameters.reduce((result: Record<string, never>, param) => {
		let { value } = param;
		if (param.type === "integer") value = parseInt(value as unknown as string, 10) as never;
		// eslint-disable-next-line no-param-reassign
		result[param.name] = value as never;
		return result;
	}, {});

const workflowParametersToEditorWorkflowParameters = async (
	serviceId: string,
	areaId: string,
	isAction: boolean,
	parameters: Record<string, never>,
): Promise<AreaParameterWithValue[]> => {
	const areas = isAction
		? await services.services.getServiceActions(serviceId)
		: await services.services.getServiceReactions(serviceId);
	const { parametersFormFlow } = areas.data!.find((a) => a.id === areaId)!;

	return parametersFormFlow.map((formFlowParam) => ({ ...formFlowParam, value: parameters[formFlowParam.name] }));
};

export const convertWorkflowToEditorWorkflow = async (workflow: Workflow): Promise<EditorWorkflow> => {
	const actionImageUrl = await services.services.getOne(workflow.action.areaServiceId);

	return {
		id: workflow.id,
		name: workflow.name,
		action: {
			id: workflow.action.id,
			parameters: workflow.action.parameters,
			area: {
				id: workflow.action.areaId,
				parameters: await workflowParametersToEditorWorkflowParameters(
					workflow.action.areaServiceId,
					workflow.action.areaId,
					true,
					workflow.action.parameters,
				),
			},
			areaService: {
				id: workflow.action.areaServiceId,
				imageUrl: actionImageUrl.data!.imageUrl,
			},
		},
		reactions: await Promise.all(
			workflow.reactions.map(async (baseReaction) => {
				const reactionService = await services.services.getOne(baseReaction.areaServiceId);
				return {
					id: baseReaction.id,
					parameters: baseReaction.parameters,
					area: {
						id: baseReaction.areaId,
						parameters: await workflowParametersToEditorWorkflowParameters(
							baseReaction.areaServiceId,
							baseReaction.areaId,
							false,
							baseReaction.parameters,
						),
					},
					areaService: {
						id: baseReaction.areaServiceId,
						imageUrl: reactionService.data!.imageUrl,
					},
					previousAreaId: baseReaction.previousAreaId,
				};
			}),
		),
		active: workflow.active,
	};
};
