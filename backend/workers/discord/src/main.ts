import DiscordOauth2 from "discord-oauth2";
import { getFromEnv } from "./util/params";
import onGuildJoin from "./guilds/on-join";

const areas: Record<string, (client: DiscordOauth2) => Promise<void>> = {
	"on-guild-join": onGuildJoin,
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
