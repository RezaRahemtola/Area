import { axiosInstance } from "@/services";
import { SERVICE_ERROR_UNKNOWN } from "@/config/services";
import { ServiceReturn } from "@/types/api";
import { Service } from "@/types/services";

const getAll = async (
	has?: "actions" | "reactions",
	isAuthenticator: boolean = false,
): Promise<ServiceReturn<Service[]>> => {
	try {
		// eslint-disable-next-line no-nested-ternary
		const query = has !== undefined ? `?has=${has}` : isAuthenticator ? "?isAuthenticator=true" : "";
		const response = await axiosInstance.get<Service[]>(`/services${query}`);
		return { data: response.data, error: undefined };
	} catch (error) {
		return { data: null, error: SERVICE_ERROR_UNKNOWN };
	}
};

const getOne = async (serviceId: string): Promise<ServiceReturn<Service>> => {
	try {
		const response = await axiosInstance.get<Service>(`/services/${serviceId}`);
		return { data: response.data, error: undefined };
	} catch (error) {
		return { data: null, error: SERVICE_ERROR_UNKNOWN };
	}
};

export { getAll, getOne };
