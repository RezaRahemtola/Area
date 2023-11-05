import { z, ZodSchema } from "zod";
import { configDotenv } from "dotenv";

configDotenv();

export const DiscordAuthSchema = z.object({
	token_type: z.string(),
	expires_in: z.number(),
	access_token: z.string(),
	refresh_token: z.string(),
});
type DiscordAuthType = z.infer<typeof DiscordAuthSchema>;

export const DiscordDataSchema = z.object({
	auth: DiscordAuthSchema,
	target: z.string().optional(),
	identifier: z.string(),
	workflowStepId: z.string(),
});
export type DiscordDataType = z.infer<typeof DiscordDataSchema>;

export function getFromEnv(key: string) {
	const value = process.env[key];
	if (!value) {
		throw new Error(`Missing environment variable ${key}`);
	}
	return value;
}

export default function parseArguments<T>(schema: ZodSchema): T {
	const data: Record<string, string | DiscordAuthType> = {};
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
			data.auth = DiscordAuthSchema.parse(JSON.parse(data.auth as string));
		}
		ret = schema.parse(data);
	} catch (e) {
		console.error(e);
		process.exit(1);
	}
	return ret;
}
