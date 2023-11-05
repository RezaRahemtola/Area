import { z } from "zod";

export const DiscordSnowFlakeSchema = z.string().regex(/^\d{17,19}$/);
export type DiscordSnowFlakeType = z.infer<typeof DiscordSnowFlakeSchema>;

export const DiscordAuthSchema = z.object({
	token_type: z.string().optional(),
	expires_in: z.number().optional(),
	access_token: z.string(),
	refresh_token: z.string().optional(),
});
export type DiscordAuthType = z.infer<typeof DiscordAuthSchema>;

export const DiscordDataSchema = z.object({
	auth: DiscordAuthSchema,
	target: z.string().optional(),
	identifier: z.string(),
	workflowStepId: z.string(),
});
export type DiscordDataType = z.infer<typeof DiscordDataSchema>;
