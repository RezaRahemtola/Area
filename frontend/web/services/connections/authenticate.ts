import { ServiceReturn } from "@/types/api";
import { axiosInstance } from "@/services";
import { SERVICE_ERROR_UNKNOWN } from "@/config/services";

type AuthenticateResponse = {
	oauthUrl: string;
};
const authenticate = async (serviceId: string): Promise<ServiceReturn<string>> => {
	try {
		const response = await axiosInstance.get<AuthenticateResponse>(`/connections/${serviceId}/authenticate`);
		return { data: response.data.oauthUrl, error: undefined };
	} catch (error) {
		return { data: null, error: SERVICE_ERROR_UNKNOWN };
	}
};

export default authenticate;
