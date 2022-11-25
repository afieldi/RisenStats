import PlayerStatModel from "../../models/playerstat.model";

export interface GetLeaderboardResponse {
    playerStats: PlayerStatModel[]
}

export interface GetLeaderboardRequest {
    seasonId?: number;
    roleId?: string;
    risenOnly?: boolean;
}