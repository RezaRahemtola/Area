import { isAxiosError } from "axios";
import { StatusCodes } from "http-status-codes";
import { axiosInstance } from "@/services";
import { SERVICE_ERROR_UNKNOWN } from "@/config/services";
import { ServiceReturn } from "@/types/api";

type CheckConnectionReturn = {
	oauthUrl: string | null;
};
const connect = async (serviceId: string, scopes: string[]): Promise<ServiceReturn<CheckConnectionReturn>> => {
	try {
		const response = await axiosInstance.post<CheckConnectionReturn>(`/connections/${serviceId}/connect`, {
			scopes,
		});

		return { data: response.data, error: undefined };
	} catch (error) {
		if (isAxiosError(error) && error.response?.status === StatusCodes.CONFLICT) {
			// Account already exists with the necessary permissions
			return { data: { oauthUrl: null }, error: undefined };
		}
		return { data: null, error: SERVICE_ERROR_UNKNOWN };
	}
};

// eslint-disable-next-line import/prefer-default-export
export { connect };
