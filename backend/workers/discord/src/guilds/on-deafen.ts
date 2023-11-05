import type DiscordOauth2 from "discord-oauth2";
import { credentials } from "@grpc/grpc-js";
import { z } from "zod";
import parseArguments from "../util/params";
import { AreaBackServiceClient } from "../proto/area_back";
import { DiscordDataSchema, DiscordSnowFlakeSchema } from "../util/types";
import { onAction } from "../util/grpc";

const REFRESH_TIMEOUT_SECONDS = 10;

const OnGuildDeafParamsSchema = z.object({
	guildId: DiscordSnowFlakeSchema,
});

const OnGuildDeafSchema = z.intersection(OnGuildDeafParamsSchema, DiscordDataSchema);

export default async function onGuildDeafen(discordClient: DiscordOauth2) {
	const params = parseArguments(OnGuildDeafSchema);
	const client = new AreaBackServiceClient(params.target ?? "localhost:50050", credentials.createInsecure());
	const getGuildMember = async () => discordClient.getGuildMember(params.auth.access_token, params.guildId);
	let { deaf: initialDeafState } = await getGuildMember();

	setInterval(async () => {
		const { deaf: newDeafState } = await getGuildMember();

		if (newDeafState !== initialDeafState) {
			initialDeafState = newDeafState;
			if (!newDeafState) return;
			await onAction(client, {
				name: "discord-on-guild-deafen",
				identifier: params.identifier,
				params: {},
			});
		}
	}, REFRESH_TIMEOUT_SECONDS * 1000);
}
