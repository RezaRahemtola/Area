import type DiscordOauth2 from "discord-oauth2";
import { credentials } from "@grpc/grpc-js";
import { z } from "zod";
import parseArguments from "../util/params";
import { AreaBackServiceClient } from "../proto/area_back";
import { DiscordDataSchema, DiscordSnowFlakeSchema } from "../util/types";
import { onAction, onError } from "../util/grpc";

const REFRESH_TIMEOUT_SECONDS = 10;

const OnGuildBoostParamsSchema = z.object({
	guildId: DiscordSnowFlakeSchema,
});

const OnGuildBoostSchema = z.intersection(OnGuildBoostParamsSchema, DiscordDataSchema);

export default async function onGuildBoost(discordClient: DiscordOauth2) {
	const params = parseArguments(OnGuildBoostSchema);
	const client = new AreaBackServiceClient(params.target ?? "localhost:50050", credentials.createInsecure());
	const getGuildMember = async () => discordClient.getGuildMember(params.auth.access_token, params.guildId);
	const getUserGuilds = async () => discordClient.getUserGuilds(params.auth.access_token);
	const getGuild = async () => (await getUserGuilds()).find(({ id }) => params.guildId === id);

	let { premium_since: initialPremiumSince } = await getGuildMember();

	if (initialPremiumSince === undefined || initialPremiumSince === null) {
		await onError(client, {
			identifier: params.identifier,
			error: "discord-on-guild-boost",
			isAuthError: false,
		});
		return;
	}

	setInterval(async () => {
		const { premium_since: newPremiumSince } = await getGuildMember();

		if (newPremiumSince === undefined || newPremiumSince === null) {
			await onError(client, {
				error: "discord-on-guild-boost",
				identifier: params.identifier,
				isAuthError: false,
			});
			return;
		}

		if (newPremiumSince !== initialPremiumSince) {
			initialPremiumSince = newPremiumSince;
			const guild = await getGuild();
			if (!guild) {
				await onError(client, {
					error: "discord-on-guild-boost",
					identifier: params.identifier,
					isAuthError: false,
				});
				return;
			}
			await onAction(client, {
				name: "discord-on-guild-boost",
				identifier: params.identifier,
				params: {},
			});
		}
	}, REFRESH_TIMEOUT_SECONDS * 1000);
}
