import axios, { isAxiosError } from "axios";
import { StatusCodes } from "http-status-codes";

import { AuthResult, Credentials } from "@/types/user";
import { ServiceReturn } from "@/types/api";
import { SERVICE_ERROR_UNKNOWN } from "@/config/services";
import { API_URL } from "@/config/environment";
import formatApiErrorMessage from "@/utils/api";

const login = async ({ email, password }: Credentials): Promise<ServiceReturn<string>> => {
	try {
		const response = await axios.post<AuthResult>(`${API_URL}/auth/login`, { email, password });
		return { data: response.data.accessToken, error: undefined };
	} catch (error) {
		if (!isAxiosError(error)) return { data: null, error: SERVICE_ERROR_UNKNOWN };

		if (error.response?.status === StatusCodes.BAD_REQUEST) {
			return { data: null, error: formatApiErrorMessage(error.response.data?.message) };
		}
		if (error.response?.status === StatusCodes.UNAUTHORIZED) {
			return { data: null, error: "Invalid email and/or password." };
		}
		return { data: null, error: SERVICE_ERROR_UNKNOWN };
	}
};

export default login;
