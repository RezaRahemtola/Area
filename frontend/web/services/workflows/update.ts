import { ServiceReturn } from "@/types/api";
import { axiosInstance } from "@/services";
import { SERVICE_ERROR_UNKNOWN } from "@/config/services";

type ToggleWorkflowReturn = {
	newState: boolean;
};
export const toggleOne = async (workflowId: string, active: boolean): Promise<ServiceReturn<ToggleWorkflowReturn>> => {
	try {
		const response = await axiosInstance.patch<ToggleWorkflowReturn>(`/workflows/toggle/${workflowId}`, {
			newState: active,
		});
		return { data: response.data, error: undefined };
	} catch (error) {
		return { data: null, error: SERVICE_ERROR_UNKNOWN };
	}
};

export const toggleBulk = async (workflowIds: string[], active: boolean): Promise<ServiceReturn<void>> => {
	try {
		const response = await axiosInstance.patch<void>(`/workflows/toggle/bulk`, {
			workflows: workflowIds,
			newState: active,
		});
		return { data: response.data, error: undefined };
	} catch (error) {
		return { data: null, error: SERVICE_ERROR_UNKNOWN };
	}
};
