import type DiscordOauth2 from "discord-oauth2";
import { credentials } from "@grpc/grpc-js";
import parseArguments from "../util/params";
import { AreaBackServiceClient } from "../proto/area_back";
import { onAction } from "../util/grpc";
import { DiscordDataSchema } from "../util/types";

const REFRESH_TIMEOUT_SECONDS = 10;

export default async function onGuildJoin(discordClient: DiscordOauth2) {
	const params = parseArguments(DiscordDataSchema);
	const client = new AreaBackServiceClient(params.target ?? "localhost:50050", credentials.createInsecure());
	const getUserGuilds = async () => discordClient.getUserGuilds(params.auth.access_token);
	let initialGuilds = await getUserGuilds();

	setInterval(async () => {
		const newGuilds = await getUserGuilds();
		const diff = newGuilds.filter((newGuild) => !initialGuilds.find((initialGuild) => initialGuild.id === newGuild.id));

		if (diff.length > 0) {
			initialGuilds = newGuilds;
			await Promise.all(
				diff.map(async ({ name: guildName }) =>
					onAction(client, {
						name: "discord-on-guild-join",
						identifier: params.identifier,
						params: {
							guildName,
						},
					}),
				),
			);
		}
	}, REFRESH_TIMEOUT_SECONDS * 1000);
}
