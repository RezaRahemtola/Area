import { axiosInstance } from "@/services";
import { SERVICE_ERROR_UNKNOWN } from "@/config/services";
import { ServiceReturn } from "@/types/api";
import { User, UserProfileUpdate } from "@/types/user";

const getProfile = async (): Promise<ServiceReturn<User>> => {
	try {
		const response = await axiosInstance.get<User>(`/me`);
		return { data: response.data, error: undefined };
	} catch (error) {
		return { data: null, error: SERVICE_ERROR_UNKNOWN };
	}
};

const updateProfile = async (data: UserProfileUpdate): Promise<ServiceReturn<void>> => {
	try {
		const response = await axiosInstance.patch(`/me`, data);
		return { data: response.data, error: undefined };
	} catch (error) {
		return { data: null, error: SERVICE_ERROR_UNKNOWN };
	}
};

export type UserStats = {
	workflowRuns: number;
	workflowErrors: number;
	workflows: number;
	activeWorkflows: number;
};
const getStats = async (): Promise<ServiceReturn<UserStats>> => {
	try {
		const response = await axiosInstance.get<UserStats>(`/workflows/summary`);
		return { data: response.data, error: undefined };
	} catch (error) {
		return { data: null, error: SERVICE_ERROR_UNKNOWN };
	}
};

export { getProfile, updateProfile, getStats };
