import env from "@/utils/environment";

// eslint-disable-next-line import/prefer-default-export
export const API_URL = env("NEXT_PUBLIC_API_URL", false).default("http://localhost:8080").asString();
