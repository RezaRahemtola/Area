import DiscordOauth2 from "discord-oauth2";
import { getFromEnv } from "./util/params";
import onGuildJoin from "./guilds/on-join";
import onGuildLeave from "./guilds/on-leave";
import onGuildBoost from "./guilds/on-boost";
import onGuildDeafen from "./guilds/on-deafen";
import onGuildMute from "./guilds/on-mute";
import onGuildTimeout from "./guilds/on-timeout";
import onGuildNicknameChange from "./guilds/on-nickname-change";
import onGuildAvatarChange from "./guilds/on-avatar-change";
import onGuildRolesChange from "./guilds/on-roles-change";
import onAvatarChange from "./user/on-avatar-change";

const areas: Record<string, (client: DiscordOauth2) => Promise<void>> = {
	"on-guild-join": onGuildJoin,
	"on-guild-leave": onGuildLeave,
	"on-guild-boost": onGuildBoost,
	"on-guild-deafen": onGuildDeafen,
	"on-guild-mute": onGuildMute,
	"on-guild-timeout": onGuildTimeout,
	"on-guild-nickname-change": onGuildNicknameChange,
	"on-guild-avatar-change": onGuildAvatarChange,
	"on-guild-roles-change": onGuildRolesChange,
	"on-avatar-change": onAvatarChange,
};

async function main() {
	const job = process.argv[2];
	if (!job) {
		console.log("Error: No job specified");
		process.exit(1);
	}

	const runJob = areas[job];
	if (!runJob) {
		console.log("Error: Unknown job");
		process.exit(1);
	}

	const client = new DiscordOauth2({
		clientId: getFromEnv("DISCORD_CLIENT_ID"),
		clientSecret: getFromEnv("DISCORD_CLIENT_SECRET"),
	});
	await runJob(client);
}

main();
