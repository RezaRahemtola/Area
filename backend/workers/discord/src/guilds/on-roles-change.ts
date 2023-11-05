import type DiscordOauth2 from "discord-oauth2";
import { credentials } from "@grpc/grpc-js";
import { z } from "zod";
import parseArguments from "../util/params";
import { AreaBackServiceClient } from "../proto/area_back";
import { DiscordDataSchema, DiscordSnowFlakeSchema } from "../util/types";
import { onAction } from "../util/grpc";

const REFRESH_TIMEOUT_SECONDS = 60;

const OnGuildRolesChangeParamsSchema = z.object({
	guildId: DiscordSnowFlakeSchema,
});

const OnGuildRolesChangeSchema = z.intersection(OnGuildRolesChangeParamsSchema, DiscordDataSchema);

export default async function onGuildRolesChange(discordClient: DiscordOauth2) {
	const params = parseArguments(OnGuildRolesChangeSchema);
	const client = new AreaBackServiceClient(params.target ?? "localhost:50050", credentials.createInsecure());
	const getGuildMember = async () => discordClient.getGuildMember(params.auth.access_token, params.guildId);
	let { roles: initialRoles } = await getGuildMember();

	setInterval(async () => {
		const { roles: newRoles } = await getGuildMember();
		const addedRoles = newRoles.filter(
			(newRole) => !initialRoles.find((initialRole) => initialRole === newRole),
		).length;
		const removedRoles = initialRoles.filter(
			(initialRole) => !newRoles.find((newRole) => initialRole === newRole),
		).length;

		if (removedRoles > 0 || addedRoles > 0) {
			initialRoles = newRoles;
			await onAction(client, {
				name: "discord-on-guild-nickname-change",
				identifier: params.identifier,
				params: {
					addedRoles,
					removedRoles,
				},
			});
		}
	}, REFRESH_TIMEOUT_SECONDS * 1000);
}
