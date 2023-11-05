import DiscordOauth2 from "discord-oauth2";
import { credentials } from "@grpc/grpc-js";
import { z } from "zod";
import parseArguments from "../util/params";
import { AreaBackServiceClient } from "../proto/area_back";
import { DiscordDataSchema, DiscordSnowFlakeSchema } from "../util/types";
import { onAction } from "../util/grpc";

const REFRESH_TIMEOUT_SECONDS = 10;

const OnAvatarChangeParamsSchema = z.object({
	guildId: DiscordSnowFlakeSchema,
});

const OnAvatarChangeSchema = z.intersection(OnAvatarChangeParamsSchema, DiscordDataSchema);

export default async function onAvatarChange(discordClient: DiscordOauth2) {
	const params = parseArguments(OnAvatarChangeSchema);
	const client = new AreaBackServiceClient(params.target ?? "localhost:50050", credentials.createInsecure());
	const getUser = async () => discordClient.getUser(params.auth.access_token);
	let { avatar: initialAvatarHash } = await getUser();

	setInterval(async () => {
		const { avatar: newAvatarHash } = await getUser();

		if (newAvatarHash !== initialAvatarHash) {
			initialAvatarHash = newAvatarHash;
			await onAction(client, {
				name: "discord-on-avatar-change",
				identifier: params.identifier,
				params: {
					newAvatarUrl: `${newAvatarHash}`,
				},
			});
		}
	}, REFRESH_TIMEOUT_SECONDS * 1000);
}
