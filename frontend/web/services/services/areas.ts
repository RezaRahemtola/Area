import { axiosInstance } from "@/services";
import { SERVICE_ERROR_UNKNOWN } from "@/config/services";
import { ServiceReturn } from "@/types/api";
import { Area } from "@/types/services";

const getServiceActions = async (serviceId: string): Promise<ServiceReturn<Area[]>> => {
	try {
		const response = await axiosInstance.get<Area[]>(`/services/${serviceId}/actions`);
		return { data: response.data, error: undefined };
	} catch (error) {
		return { data: null, error: SERVICE_ERROR_UNKNOWN };
	}
};

const getServiceReactions = async (serviceId: string): Promise<ServiceReturn<Area[]>> => {
	try {
		const response = await axiosInstance.get<Area[]>(`/services/${serviceId}/reactions`);
		return { data: response.data, error: undefined };
	} catch (error) {
		return { data: null, error: SERVICE_ERROR_UNKNOWN };
	}
};

export { getServiceActions, getServiceReactions };
