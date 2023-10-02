import { isAxiosError } from "axios";
import { StatusCodes } from "http-status-codes";

import { axiosInstance } from "@/services";
import { AuthResult, Credentials } from "@/types/user";
import { ServiceReturn } from "@/types/api";
import { SERVICE_ERROR_UNKNOWN } from "@/config/services";

const login = async ({ email, password }: Credentials): Promise<ServiceReturn<string>> => {
	try {
		const response = await axiosInstance.post<AuthResult>("/auth/login", { email, password });
		return { data: response.data.accessToken, error: undefined };
	} catch (error) {
		if (!isAxiosError(error)) return { data: null, error: SERVICE_ERROR_UNKNOWN };

		if (error.response?.status === StatusCodes.BAD_REQUEST) {
			return { data: null, error: error.response.data?.message.join("\n") };
		}
		if (error.response?.status === StatusCodes.UNAUTHORIZED) {
			return { data: null, error: "Invalid email and/or password." };
		}
		return { data: null, error: SERVICE_ERROR_UNKNOWN };
	}
};

export default login;
