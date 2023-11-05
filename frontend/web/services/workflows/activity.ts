import { ServiceReturn } from "@/types/api";
import { axiosInstance } from "@/services";
import { SERVICE_ERROR_UNKNOWN } from "@/config/services";
import { Activity } from "@/types/activity";

const getActivities = async (page: number): Promise<ServiceReturn<Activity[]>> => {
	try {
		const response = await axiosInstance.get<Activity[]>(`/activity?page=${page}&itemsPerPage=20`);
		return { data: response.data, error: undefined };
	} catch (error) {
		return { data: null, error: SERVICE_ERROR_UNKNOWN };
	}
};

export default getActivities;
