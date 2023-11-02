import { RiotAPI } from "@fightmegg/riot-api";
import { credentials } from "@grpc/grpc-js";
import parseArguments, { getFromEnv } from "../util/params";
import { AreaBackServiceClient } from "../proto/area_back";
import "../proto/google/protobuf/struct";
import { onReaction } from "../util/grpc";
import {
	handleRiotError,
	LolCluster,
	LolDataSchema,
	LolDataType,
	RiotGamesError,
	RiotRegionToLolCluster,
	RiotRegionToLolRegion,
} from "../util/types";

type NewMatchArgs = {
	riot: RiotAPI;
	client: AreaBackServiceClient;
	identifier: string;
	cluster: LolCluster;
	matchId: string;
	playerId: string;
};

const REFRESH_TIMEOUT = 10;

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

export default async function onLolMatch() {
	const params = parseArguments<LolDataType>(LolDataSchema);
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
		lastMatch = matches.length === 0 ? undefined : matches[0];

		setInterval(async () => {
			try {
				matches = await riot.matchV5.getIdsByPuuid({
					cluster: RiotRegionToLolCluster[params.region],
					puuid,
				});

				if (matches.length > 0 && lastMatch !== matches[0]) {
					await sendNewMatchData({
						riot,
						client,
						identifier: params.identifier,
						cluster: RiotRegionToLolCluster[params.region],
						matchId: matches[0]!,
						playerId: puuid,
					});
					lastMatch = matches[0]!;
				}
			} catch (e) {
				await handleRiotError(e as RiotGamesError, client, params.identifier);
			}
		}, REFRESH_TIMEOUT * 1000);
	} catch (e) {
		await handleRiotError(e as RiotGamesError, client, params.identifier);
	}
}
