import axios from "axios";

import { API_URL } from "@/config/environment";
import authService from "@/services/auth";

const axiosInstance = axios.create({
	baseURL: API_URL,
});

axiosInstance.interceptors.request.use((config) => {
	const newConfig = config;
	const token = localStorage.getItem("areaAuthToken");

	newConfig.headers.Authorization = token ? `Bearer ${token}` : "";
	return newConfig;
});

const services = {
	auth: authService,
};

export default services;
export { axiosInstance };
