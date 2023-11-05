import type DiscordOauth2 from "discord-oauth2";
import { credentials } from "@grpc/grpc-js";
import { z } from "zod";
import parseArguments from "../util/params";
import { AreaBackServiceClient } from "../proto/area_back";
import { DiscordDataSchema, DiscordSnowFlakeSchema } from "../util/types";
import { onAction } from "../util/grpc";

const REFRESH_TIMEOUT_SECONDS = 60;

const OnGuildMutedParamsSchema = z.object({
	guildId: DiscordSnowFlakeSchema,
});

const OnGuildMutedSchema = z.intersection(OnGuildMutedParamsSchema, DiscordDataSchema);

export default async function onGuildMute(discordClient: DiscordOauth2) {
	const params = parseArguments(OnGuildMutedSchema);
	const client = new AreaBackServiceClient(params.target ?? "localhost:50050", credentials.createInsecure());
	const getGuildMember = async () => discordClient.getGuildMember(params.auth.access_token, params.guildId);
	let { mute: initialMuteState } = await getGuildMember();

	setInterval(async () => {
		const { mute: newMuteState } = await getGuildMember();

		if (newMuteState !== initialMuteState) {
			initialMuteState = newMuteState;
			if (!newMuteState) return;
			await onAction(client, {
				name: "discord-on-guild-muted",
				identifier: params.identifier,
				params: {},
			});
		}
	}, REFRESH_TIMEOUT_SECONDS * 1000);
}
