import { z } from "zod";
import { credentials } from "@grpc/grpc-js";
import parseArguments, { getFromEnv, RiotAuthSchema } from "../util/params";
import { AreaBackServiceClient } from "../proto/area_back";
import "../proto/google/protobuf/struct";
import { onError, onReaction } from "../util/grpc";
import { RiotAPI } from "@fightmegg/riot-api";
import { LolCluster, RiotGamesError, RiotRegion, RiotRegionToLolCluster, RiotRegionToLolRegion } from "../util/types";

type NewMatchArgs = {
	riot: RiotAPI;
	client: AreaBackServiceClient;
	identifier: string;
	cluster: LolCluster;
	matchId: string;
	playerId: string;
};

const LolMatchSchema = z.object({
	auth: RiotAuthSchema,
	target: z.string().optional(),
	identifier: z.string(),
	region: z.enum(RiotRegion),
	summoner: z.string(),
});
type LolMatchType = z.infer<typeof LolMatchSchema>;

const REFRESH_TIMEOUT = 10;

export default async function onLolMatch() {
	const params = parseArguments<LolMatchType>(LolMatchSchema);
	const client = new AreaBackServiceClient(params.target ?? "localhost:50050", credentials.createInsecure());

	try {
		const riot = new RiotAPI(getFromEnv("RIOT_API_KEY"));
		const { puuid } = await riot.summoner.getBySummonerName({
			region: RiotRegionToLolRegion[params.region],
			summonerName: params.summoner,
		});

		let lastMatch: string | undefined;
		let matches = await riot.matchV5.getIdsByPuuid({
			cluster: RiotRegionToLolCluster[params.region],
			puuid,
		});
		lastMatch = matches[0];
		console.log("Last match is ", lastMatch);

		setInterval(async () => {
			console.log("Fetching for new matches");
			matches = await riot.matchV5.getIdsByPuuid({
				cluster: RiotRegionToLolCluster[params.region],
				puuid,
			});

			console.log(lastMatch, " vs ", matches[0]);
			if (lastMatch !== matches[0] && matches[0] !== undefined) {
				await sendNewMatchData({
					riot,
					client,
					identifier: params.identifier,
					cluster: RiotRegionToLolCluster[params.region],
					matchId: matches[0],
					playerId: puuid,
				});
				lastMatch = matches[0];
			}
		}, REFRESH_TIMEOUT * 1000);
	} catch (e) {
		const error = e as RiotGamesError;
		await onError(client, {
			identifier: params.identifier,
			error: error.statusText,
			isAuthError: false,
		});
	}
}

async function sendNewMatchData({ riot, client, identifier, cluster, matchId, playerId }: NewMatchArgs) {
	const lastMatch = await riot.matchV5.getMatchById({
		cluster,
		matchId,
	});

	const player = lastMatch.info.participants.find((p) => p.puuid === playerId);
	if (!player) {
		return;
	}

	const data = {
		kills: player.kills,
		deaths: player.deaths,
		assists: player.assists,
		champion: player.championName,
		level: player.champLevel,
	};

	await onReaction(client, {
		name: "riot-on-game-end",
		identifier,
		params: {
			win: player.win,
			...data,
		},
	});

	const altName = `riot-on-game-${player.win ? "win" : "loss"}`;
	const altIdentifer = `${altName}-${identifier.substring(17)}`;

	await onReaction(client, {
		name: altName,
		identifier: altIdentifer,
		params: {
			...data,
		},
	});
}
