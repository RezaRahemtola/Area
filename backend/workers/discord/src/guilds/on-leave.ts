import type DiscordOauth2 from "discord-oauth2";
import { credentials } from "@grpc/grpc-js";
import { z } from "zod";
import parseArguments from "../util/params";
import { AreaBackServiceClient } from "../proto/area_back";
import { onAction } from "../util/grpc";
import { DiscordDataSchema, DiscordSnowFlakeSchema } from "../util/types";

const REFRESH_TIMEOUT_SECONDS = 10;

const OnGuildLeaveParamsSchema = z.object({
	guildId: DiscordSnowFlakeSchema.optional(),
});

const OnGuildLeaveSchema = z.intersection(OnGuildLeaveParamsSchema, DiscordDataSchema);

export default async function onGuildLeave(discordClient: DiscordOauth2) {
	const params = parseArguments(OnGuildLeaveSchema);
	const client = new AreaBackServiceClient(params.target ?? "localhost:50050", credentials.createInsecure());
	const getUserGuilds = async () => discordClient.getUserGuilds(params.auth.access_token);
	let initialGuilds = await getUserGuilds();

	setInterval(async () => {
		const newGuilds = await getUserGuilds();
		const diff = initialGuilds.filter((initialGuild) => !newGuilds.find((newGuild) => newGuild.id === initialGuild.id));

		if (diff.length > 0) {
			initialGuilds = newGuilds;
			await Promise.all(
				diff
					.filter(({ id }) => !params.guildId || params.guildId === id)
					.map(async ({ name: guildName }) =>
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
