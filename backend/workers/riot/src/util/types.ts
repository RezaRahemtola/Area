import { PlatformId, RiotAPITypes } from "@fightmegg/riot-api";
import LoLRegion = RiotAPITypes.LoLRegion;
import Cluster = RiotAPITypes.Cluster;

export const RiotRegion = ["br", "eun", "euw", "jp", "kr", "la", "la2", "na", "oc", "tr", "ru"] as const;
export type RiotRegionType = (typeof RiotRegion)[number];

export const RiotRegionToLolRegion: Record<RiotRegionType, LoLRegion> = {
	br: PlatformId.BR1,
	eun: PlatformId.EUNE1,
	euw: PlatformId.EUW1,
	jp: PlatformId.JP1,
	kr: PlatformId.KR,
	la: PlatformId.LA1,
	la2: PlatformId.LA2,
	na: PlatformId.NA1,
	oc: PlatformId.OC1,
	tr: PlatformId.TR1,
	ru: PlatformId.RU,
};

export type LolCluster = Exclude<Cluster, PlatformId.ESPORTS>;
export const RiotRegionToLolCluster: Record<RiotRegionType, LolCluster> = {
	br: PlatformId.AMERICAS,
	eun: PlatformId.EUROPE,
	euw: PlatformId.EUROPE,
	jp: PlatformId.ASIA,
	kr: PlatformId.ASIA,
	la: PlatformId.AMERICAS,
	la2: PlatformId.AMERICAS,
	na: PlatformId.AMERICAS,
	oc: PlatformId.SEA,
	tr: PlatformId.EUROPE,
	ru: PlatformId.EUROPE,
};

export type RiotGamesError = {
	status: number;
	statusText: string;
};
