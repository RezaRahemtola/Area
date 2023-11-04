import { z, ZodSchema } from "zod";
import { configDotenv } from "dotenv";

configDotenv();

export const MicrosoftAuthSchema = z.object({
	token_type: z.string().optional(),
	expires_in: z.number().optional(),
	access_token: z.string(),
	refresh_token: z.string().optional(),
	ext_expires_in: z.number().optional(),
});
type MicrosoftAuthType = z.infer<typeof MicrosoftAuthSchema>;

export function getFromEnv(key: string) {
	const value = process.env[key];
	if (!value) {
		throw new Error(`Missing environment variable ${key}`);
	}
	return value;
}

export default function parseArguments<T>(schema: ZodSchema): T {
	const data: Record<string, string | MicrosoftAuthType> = {};
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
			const auth = MicrosoftAuthSchema.parse(JSON.parse(data.auth as string));
			data.auth = auth;
		}
		ret = schema.parse(data);
	} catch (e) {
		console.error(e);
		process.exit(1);
	}
	return ret;
}
