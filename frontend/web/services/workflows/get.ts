import { ServiceReturn } from "@/types/api";
import { axiosInstance } from "@/services";
import { SERVICE_ERROR_UNKNOWN } from "@/config/services";
import { Workflow } from "@/types/workflows";

export const getAll = async (): Promise<ServiceReturn<Workflow[]>> => {
	try {
		const response = await axiosInstance.get<Workflow[]>(`/workflows`);
		return { data: response.data, error: undefined };
	} catch (error) {
		return { data: null, error: SERVICE_ERROR_UNKNOWN };
	}
};

export const getOne = async (workflowId: string): Promise<ServiceReturn<Workflow>> => {
	try {
		const response = await axiosInstance.get<Workflow>(`/workflows/${workflowId}`);
		return { data: response.data, error: undefined };
	} catch (error) {
		return { data: null, error: SERVICE_ERROR_UNKNOWN };
	}
};
