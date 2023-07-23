import PlayerStatModel from "../../models/playerstat.model";
import AggregatedPlayerStatModel from "../../models/aggregatedplayerstat.model";

export interface PlayerStatsTableRequest {
  playerNames: string[];
  games: number;
}

export interface GetPlayerStatsResponse {
  playerStats: AggregatedPlayerStatModel[]
}

export interface GetPlayerStatsRequest {
  seasonId?: number;
  roleId?: string;
  teamId?: number,
  championId?: number,
  risenOnly?: boolean;
}

export interface GetPlayerStatsByDateAndSeasonRequest {
  seasonId: number;
  timeStart: number;
  timeEnd: number;
}

export interface GetPlayerStatsByDateAndSeasonResponse {
  playerStats: AggregatedPlayerStatModel[];
}
