import type DiscordOauth2 from "discord-oauth2";
import { credentials } from "@grpc/grpc-js";
import { z } from "zod";
import parseArguments from "../util/params";
import { AreaBackServiceClient } from "../proto/area_back";
import { DiscordDataSchema, DiscordSnowFlakeSchema } from "../util/types";
import { onAction, onError } from "../util/grpc";

const REFRESH_TIMEOUT_SECONDS = 10;

const OnGuildTimeoutParamsSchema = z.object({
	guildId: DiscordSnowFlakeSchema,
});

const OnGuildTimeoutSchema = z.intersection(OnGuildTimeoutParamsSchema, DiscordDataSchema);

export default async function onGuildTimeout(discordClient: DiscordOauth2) {
	const params = parseArguments(OnGuildTimeoutSchema);
	const client = new AreaBackServiceClient(params.target ?? "localhost:50050", credentials.createInsecure());
	const getGuildMember = async () => discordClient.getGuildMember(params.auth.access_token, params.guildId);
	const getUserGuilds = async () => discordClient.getUserGuilds(params.auth.access_token);
	const getGuild = async () => (await getUserGuilds()).find(({ id }) => params.guildId === id);
	let { communication_disabled_until: initialTimeoutState } = await getGuildMember();

	setInterval(async () => {
		const { communication_disabled_until: newTimeoutState } = await getGuildMember();

		if (newTimeoutState !== initialTimeoutState) {
			initialTimeoutState = newTimeoutState;
			const guild = await getGuild();
			if (newTimeoutState && new Date().getTime() < new Date(newTimeoutState).getTime()) {
				if (!guild) {
					await onError(client, {
						error: "discord-on-guild-timeout",
						identifier: params.identifier,
						isAuthError: false,
					});
					return;
				}
				await onAction(client, {
					name: "discord-on-guild-timeout",
					identifier: params.identifier,
					params: {
						timeoutEndsAt: newTimeoutState,
					},
				});
			}
		}
	}, REFRESH_TIMEOUT_SECONDS * 1000);
}
