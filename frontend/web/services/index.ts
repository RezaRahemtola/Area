import axios from "axios";
import { StatusCodes } from "http-status-codes";
import { API_URL } from "@/config/environment";
import authService from "@/services/auth";
import servicesService from "@/services/services";
import workflowsService from "@/services/workflows";
import connectionsService from "@/services/connections";
import userService from "@/services/user";

const axiosInstance = axios.create({
	baseURL: API_URL,
});

axiosInstance.interceptors.request.use((config) => {
	const newConfig = config;
	const token = localStorage.getItem("areaAuthToken");
	// Remove useless quotes around the token
	const parsedToken = JSON.parse(token ?? "");

	newConfig.headers.Authorization = token ? `Bearer ${parsedToken}` : "";
	return newConfig;
});

axiosInstance.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response.status === StatusCodes.UNAUTHORIZED) {
			localStorage.removeItem("areaAuthToken");
			if (typeof window !== "undefined") {
				window.location.href = "/";
			}
		}
		throw error;
	},
);

const services = {
	auth: authService,
	services: servicesService,
	workflows: workflowsService,
	connections: connectionsService,
	user: userService,
};

export default services;
export { axiosInstance };
