import PlayerStatModel from "../../models/playerstat.model";

export interface PlayerStatsTableRequest {
  playerNames: string[];
  games: number;
}

export interface GetPlayerStatsResponse {
  playerStats: PlayerStatModel[]
}

export interface GetPlayerStatsRequest {
  seasonId?: number;
  roleId?: string;
  risenOnly?: boolean;
}
