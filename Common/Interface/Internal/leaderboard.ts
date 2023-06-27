import PlayerStatModel from "../../models/playerstat.model";
import AggregatedPlayerStatModel from "../../models/aggregatedplayerstat.model";

export interface GetLeaderboardResponse {
    playerStats: AggregatedPlayerStatModel[]
}

export interface GetLeaderboardRequest {
    seasonId?: number;
    roleId?: string;
    risenOnly?: boolean;
    collapseRoles?: boolean;
}