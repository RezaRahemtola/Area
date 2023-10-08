import { EditorWorkflow } from "@/types/workflows";
import { ServiceReturn } from "@/types/api";
import { axiosInstance } from "@/services";
import { SERVICE_ERROR_UNKNOWN } from "@/config/services";

type CreateWorkflowReturn = {
	id: string;
};
export const create = async (workflow: EditorWorkflow): Promise<ServiceReturn<CreateWorkflowReturn>> => {
	try {
		const response = await axiosInstance.post<CreateWorkflowReturn>(`/workflows`, {
			data: {
				name: workflow.name,
				active: workflow.active,
				action: {
					id: workflow.action.id,
					parameters: workflow.action.parameters,
					areaId: workflow.action.area?.id,
					areaServiceId: workflow.action.areaService?.id,
				},
				reactions: workflow.reactions.map((reaction) => ({
					id: reaction.id,
					parameters: reaction.parameters,
					areaId: reaction.area?.id,
					areaServiceId: reaction.areaService?.id,
					previousAreaId: reaction.previousAreaId,
				})),
			},
		});
		return { data: response.data, error: undefined };
	} catch (error) {
		return { data: null, error: SERVICE_ERROR_UNKNOWN };
	}
};

export const update = async (
	workflow: Partial<EditorWorkflow> & { id: string },
): Promise<ServiceReturn<CreateWorkflowReturn>> => {
	try {
		const response = await axiosInstance.patch<CreateWorkflowReturn>(`/workflows/${workflow.id}`, { data: workflow });
		return { data: response.data, error: undefined };
	} catch (error) {
		return { data: null, error: SERVICE_ERROR_UNKNOWN };
	}
};
