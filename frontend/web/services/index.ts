import axios from "axios";

import { API_URL } from "@/config/environment";
import authService from "@/services/auth";
import servicesService from "@/services/services";
import workflowsService from "@/services/workflows";

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

const services = {
	auth: authService,
	services: servicesService,
	workflows: workflowsService,
};

export default services;
export { axiosInstance };
