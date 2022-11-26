import {PlayerChampionStatsRequest} from "../../../Common/Interface/Internal/player";
import {GameRoles} from "../../../Common/Interface/General/gameEnums";
import {MakeBackendCall} from "./_call";
import {GetLeaderboardResponse} from "../../../Common/Interface/Internal/leaderboard";
import PlayerStatModel from "../../../Common/models/playerstat.model";

export async function getFlattenedLeaderboard(seasonId?: number, risenOnly?: boolean, roleId?: string): Promise<PlayerStatModel[]> {
    console.log(`getting leaderboard for SID: ${seasonId} RISEN: ${risenOnly} ROLE: ${roleId}`)
    let stats = await GetLeaderboards(seasonId, risenOnly, roleId);
    return stats.playerStats;
}

export async function GetLeaderboards(seasonId?: number, risenOnly?: boolean, roleId?: string): Promise<GetLeaderboardResponse> {
    const role = GameRoles[roleId as keyof typeof GameRoles];
    return await MakeBackendCall<PlayerChampionStatsRequest>(`/api/stats/leaderboards/`, "POST", {
        seasonId,
        risenOnly,
        roleId: role
    }) as GetLeaderboardResponse;
}
