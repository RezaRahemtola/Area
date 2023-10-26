import { isAxiosError } from "axios";
import { EditorWorkflow } from "@/types/workflows";
import { ServiceReturn } from "@/types/api";
import { axiosInstance } from "@/services";
import { SERVICE_ERROR_UNKNOWN } from "@/config/services";
import { convertAreaParamsToWorkflowPayloadParams } from "@/utils/workflows";

type CreateWorkflowReturn = {
	id: string;
};
export const create = async (workflow: EditorWorkflow): Promise<ServiceReturn<CreateWorkflowReturn>> => {
	try {
		const response = await axiosInstance.post<CreateWorkflowReturn>(`/workflows`, {
			name: workflow.name,
			active: workflow.active,
			action: {
				id: workflow.action.id,
				parameters: convertAreaParamsToWorkflowPayloadParams(workflow.action.area!.parameters),
				areaId: workflow.action.area?.id,
				areaServiceId: workflow.action.areaService?.id,
			},
			reactions: workflow.reactions.map((reaction) => ({
				id: reaction.id,
				parameters: convertAreaParamsToWorkflowPayloadParams(reaction.area!.parameters),
				areaId: reaction.area?.id,
				areaServiceId: reaction.areaService?.id,
				previousAreaId: reaction.previousAreaId,
			})),
		});
		return { data: response.data, error: undefined };
	} catch (error) {
		if (isAxiosError(error)) {
			return { data: null, error: error.response?.data?.message ?? SERVICE_ERROR_UNKNOWN };
		}
		return { data: null, error: SERVICE_ERROR_UNKNOWN };
	}
};

export const update = async (
	workflow: Partial<EditorWorkflow> & {
		id: string;
	},
): Promise<ServiceReturn<CreateWorkflowReturn>> => {
	try {
		const { id } = workflow;
		const response = await axiosInstance.patch<CreateWorkflowReturn>(`/workflows/${id}`, {
			name: workflow.name,
			action: {
				id: workflow.action!.id,
				parameters: convertAreaParamsToWorkflowPayloadParams(workflow.action!.area!.parameters),
				areaId: workflow.action!.area?.id,
				areaServiceId: workflow.action!.areaService?.id,
			},
			reactions: workflow.reactions!.map((reaction) => ({
				id: reaction.id,
				parameters: convertAreaParamsToWorkflowPayloadParams(reaction.area!.parameters),
				areaId: reaction.area?.id,
				areaServiceId: reaction.areaService?.id,
				previousAreaId: reaction.previousAreaId,
			})),
		});
		return { data: response.data, error: undefined };
	} catch (error) {
		return { data: null, error: SERVICE_ERROR_UNKNOWN };
	}
};

export const rename = async (id: string, name: string) => {
	try {
		const response = await axiosInstance.patch<CreateWorkflowReturn>(`/workflows/${id}`, {
			name,
		});
		return { data: response.data, error: undefined };
	} catch (error) {
		return { data: null, error: SERVICE_ERROR_UNKNOWN };
	}
};
