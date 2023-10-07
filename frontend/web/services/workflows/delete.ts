import { ServiceReturn } from "@/types/api";
import { axiosInstance } from "@/services";
import { SERVICE_ERROR_UNKNOWN } from "@/config/services";

export const deleteOne = async (workflowId: string): Promise<ServiceReturn<void>> => {
	try {
		const response = await axiosInstance.delete<void>(`/workflows/${workflowId}`);
		return { data: response.data, error: undefined };
	} catch (error) {
		return { data: null, error: SERVICE_ERROR_UNKNOWN };
	}
};

export const deleteBulk = async (workflowIds: string[]): Promise<ServiceReturn<void>> => {
	try {
		const response = await axiosInstance.delete<void>(`/workflows/bulk}`, { data: { workflows: workflowIds } });
		return { data: response.data, error: undefined };
	} catch (error) {
		return { data: null, error: SERVICE_ERROR_UNKNOWN };
	}
};
