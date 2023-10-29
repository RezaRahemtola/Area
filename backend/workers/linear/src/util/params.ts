import { z, ZodSchema } from "zod";
import { configDotenv } from "dotenv";

configDotenv();

export const LinearAuthSchema = z.object({
	expires_in: z.number().optional(),
	token_type: z.string().optional(),
	access_token: z.string(),
});
type LinearAuthType = z.infer<typeof LinearAuthSchema>;

export function getFromEnv(key: string) {
	const value = process.env[key];
	if (!value) {
		throw new Error(`Missing environment variable ${key}`);
	}
	return value;
}

export default function parseArguments<T>(schema: ZodSchema): T {
	const data: Record<string, string | LinearAuthType> = {};
	let ret: T;

	for (let i = 3; i < process.argv.length; i++) {
		if (process.argv[i]!.startsWith("--")) {
			const key = process.argv[i]!.substring(2);
			const value = process.argv[i + 1];

			if (!value) {
				console.error(`Error: ${process.argv[i]} requires an argument`);
				process.exit(1);
			}
			data[key] = value;
		}
	}

	try {
		if (data.auth) {
			const auth = LinearAuthSchema.parse(JSON.parse(data.auth as string));
			data.auth = auth;
		}
		ret = schema.parse(data);
	} catch (e) {
		console.error(e);
		process.exit(1);
	}
	return ret;
}
