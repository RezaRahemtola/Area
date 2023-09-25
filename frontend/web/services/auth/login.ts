import { axiosInstance } from "@/services";

type LoginParams = {
	email: string;
	password: string;
};
const login = async ({ email, password }: LoginParams) => {
	await axiosInstance.post("/auth/login", { email, password });
};

export default login;
