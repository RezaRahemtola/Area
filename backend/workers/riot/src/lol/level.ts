import { credentials } from "@grpc/grpc-js";
import { RiotAPI } from "@fightmegg/riot-api";
import parseArguments, { getFromEnv } from "../util/params";
import { AreaBackServiceClient } from "../proto/area_back";
import { handleRiotError, LolDataSchema, LolDataType, RiotGamesError, RiotRegionToLolRegion } from "../util/types";
import { onAction } from "../util/grpc";

const REFRESH_TIMEOUT = 10;

export default async function onLolLevelUp() {
	const params = parseArguments<LolDataType>(LolDataSchema);
	const client = new AreaBackServiceClient(params.target ?? "localhost:50050", credentials.createInsecure());

	try {
		const riot = new RiotAPI(getFromEnv("RIOT_API_KEY"));
		const { summonerLevel } = await riot.summoner.getBySummonerName({
			region: RiotRegionToLolRegion[params.region],
			summonerName: params.summoner,
		});

		setInterval(async () => {
			try {
				const { summonerLevel: newLevel } = await riot.summoner.getBySummonerName({
					region: RiotRegionToLolRegion[params.region],
					summonerName: params.summoner,
				});

				if (newLevel !== summonerLevel) {
					await onAction(client, {
						name: "riot-lol-on-level-up",
						identifier: params.identifier,
						params: {
							level: newLevel,
						},
					});
				}
			} catch (e) {
				await handleRiotError(e as RiotGamesError, client, params.identifier);
			}
		}, REFRESH_TIMEOUT * 1000);
	} catch (e) {
		await handleRiotError(e as RiotGamesError, client, params.identifier);
	}
}
