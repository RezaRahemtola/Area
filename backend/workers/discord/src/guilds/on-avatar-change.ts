import DiscordOauth2, { Member } from "discord-oauth2";
import { credentials } from "@grpc/grpc-js";
import { z } from "zod";
import parseArguments from "../util/params";
import { AreaBackServiceClient } from "../proto/area_back";
import { DiscordDataSchema, DiscordSnowFlakeSchema } from "../util/types";
import { onAction } from "../util/grpc";

const REFRESH_TIMEOUT_SECONDS = 60;

const OnGuildAvatarChangeParamsSchema = z.object({
	guildId: DiscordSnowFlakeSchema,
});

const OnGuildAvatarChangeSchema = z.intersection(OnGuildAvatarChangeParamsSchema, DiscordDataSchema);

export default async function onGuildAvatarChange(discordClient: DiscordOauth2) {
	const params = parseArguments(OnGuildAvatarChangeSchema);
	const client = new AreaBackServiceClient(params.target ?? "localhost:50050", credentials.createInsecure());
	const getGuildMember = async () => discordClient.getGuildMember(params.auth.access_token, params.guildId);
	let { avatar: initialAvatarHash }: Member & { avatar?: string } = await getGuildMember();

	setInterval(async () => {
		const { avatar: newAvatarHash }: Member & { avatar?: string } = await getGuildMember();

		if (newAvatarHash !== initialAvatarHash) {
			initialAvatarHash = newAvatarHash;
			await onAction(client, {
				name: "discord-on-guild-avatar-change",
				identifier: params.identifier,
				params: {
					newAvatarHash,
				},
			});
		}
	}, REFRESH_TIMEOUT_SECONDS * 1000);
}
