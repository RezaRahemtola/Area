import { isAxiosError } from "axios";
import { StatusCodes } from "http-status-codes";
import { axiosInstance } from "@/services";
import { SERVICE_ERROR_UNKNOWN } from "@/config/services";
import { ServiceReturn } from "@/types/api";

type CheckConnectionReturn = {
	oauthUrl: string | null;
};
const connect = async (serviceId: string, scopes: string[]): Promise<ServiceReturn<CheckConnectionReturn>> => {
	if (scopes.length === 0) {
		// Account doesn't need connection
		return { data: { oauthUrl: "" }, error: undefined };
	}
	try {
		const response = await axiosInstance.post<CheckConnectionReturn>(`/connections/${serviceId}/connect`, {
			scopes,
		});

		return { data: response.data, error: undefined };
	} catch (error) {
		if (isAxiosError(error)) {
			if (error.response?.status === StatusCodes.CONFLICT) {
				// Account already exists with the necessary permissions
				return { data: { oauthUrl: null }, error: undefined };
			}
			if (error.response?.status === StatusCodes.FORBIDDEN) {
				// Account doesn't need connection
				return { data: { oauthUrl: "" }, error: undefined };
			}
		}
		return { data: null, error: SERVICE_ERROR_UNKNOWN };
	}
};

// eslint-disable-next-line import/prefer-default-export
export { connect };
