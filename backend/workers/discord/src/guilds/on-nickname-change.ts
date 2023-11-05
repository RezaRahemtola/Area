import type DiscordOauth2 from "discord-oauth2";
import { credentials } from "@grpc/grpc-js";
import { z } from "zod";
import parseArguments from "../util/params";
import { AreaBackServiceClient } from "../proto/area_back";
import { DiscordDataSchema, DiscordSnowFlakeSchema } from "../util/types";
import { onAction } from "../util/grpc";

const REFRESH_TIMEOUT_SECONDS = 10;

const OnGuildNicknameChangeParamsSchema = z.object({
	guildId: DiscordSnowFlakeSchema,
});

const OnGuildNicknameChangeSchema = z.intersection(OnGuildNicknameChangeParamsSchema, DiscordDataSchema);

export default async function onGuildNicknameChange(discordClient: DiscordOauth2) {
	const params = parseArguments(OnGuildNicknameChangeSchema);
	const client = new AreaBackServiceClient(params.target ?? "localhost:50050", credentials.createInsecure());
	const getGuildMember = async () => discordClient.getGuildMember(params.auth.access_token, params.guildId);
	let { nick: initialNickname } = await getGuildMember();

	setInterval(async () => {
		const { nick: newNickname } = await getGuildMember();

		if (newNickname !== initialNickname) {
			initialNickname = newNickname;
			await onAction(client, {
				name: "discord-on-guild-nickname-change",
				identifier: params.identifier,
				params: {
					lastNickname: initialNickname,
					newNickname,
				},
			});
		}
	}, REFRESH_TIMEOUT_SECONDS * 1000);
}
