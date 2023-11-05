import { v4 as uuidv4 } from "uuid";

import { EditorWorkflow, EditorWorkflowAction, EditorWorkflowReaction, Workflow } from "@/types/workflows";
import { AreaParameterWithValue } from "@/types/services";
import services from "@/services";

export const getEmptyEditorAction = (id: string): EditorWorkflowAction => ({ id });
export const getEmptyEditorReaction = (previousId: string): EditorWorkflowReaction => ({
	id: uuidv4(),
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
		if (param.type === "integer") {
			value = parseInt(value as unknown as string, 10) as never;
		} else if (param.type === "text-array") {
			if (value === undefined) {
				value = [] as never;
			} else {
				value = (value as unknown as string).split(",") as never;
			}
		}
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

	return parametersFormFlow.map((formFlowParam) => {
		let value = parameters[formFlowParam.name];
		if (formFlowParam.type === "text-array") {
			value = (value as unknown as string[]).join(",") as never;
		}
		return { ...formFlowParam, value };
	});
};

export const convertWorkflowToEditorWorkflow = async (workflow: Workflow): Promise<EditorWorkflow> => {
	const actionImageUrl = await services.services.getOne(workflow.action.areaServiceId);

	return {
		id: workflow.id,
		name: workflow.name,
		action: {
			id: workflow.action.id,
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
			workflow.reactions.map(async (baseReaction): Promise<EditorWorkflowReaction> => {
				const reactionService = await services.services.getOne(baseReaction.areaServiceId);
				return {
					id: baseReaction.id,
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

export const convertWorkflowToDuplicateEditorWorkflow = async (
	workflow: Workflow,
	copyText: string,
): Promise<EditorWorkflow> => {
	const editorWorkflow = await convertWorkflowToEditorWorkflow(workflow);

	const idMapping: Record<string, string> = {};
	[editorWorkflow.action.id, ...editorWorkflow.reactions.map((e) => e.id)].forEach((id) => (idMapping[id] = uuidv4()));

	const newAction: EditorWorkflowAction = {
		id: idMapping[editorWorkflow.action.id],
		area: editorWorkflow.action.area,
		areaService: editorWorkflow.action.areaService,
	};

	const newReactions: EditorWorkflowReaction[] = editorWorkflow.reactions.map((reaction) => ({
		id: idMapping[reaction.id],
		area: reaction.area,
		areaService: reaction.areaService,
		previousAreaId: idMapping[editorWorkflow.reactions.find((e) => e.id === reaction.id)!.previousAreaId],
	}));

	return {
		name: `${editorWorkflow.name} (${copyText})`,
		action: newAction,
		reactions: newReactions,
		active: editorWorkflow.active,
	};
};

export const getSortedReactions = <T extends { previousAreaId: string; id: string }>(
	reactions: T[],
	basePreviousId: string,
): T[] => {
	const sortedReactions = [];
	let previousId = basePreviousId;

	for (let i = 0; i < reactions.length; i++) {
		const reaction = reactions.find((r) => r.previousAreaId === previousId);
		if (reaction === undefined) break;
		sortedReactions.push(reaction);
		previousId = reaction.id;
	}
	return sortedReactions;
};
