import {PlayerChampionStatsRequest} from "../../../Common/Interface/Internal/player";
import {GameRoles} from "../../../Common/Interface/General/gameEnums";
import {MakeBackendCall} from "./_call";
import {GetLeaderboardResponse} from "../../../Common/Interface/Internal/leaderboard";
import PlayerStatModel from "../../../Common/models/playerstat.model";
import {combine} from "../../../Common/utils";

export async function getFlattenedLeaderboard(seasonId?: number, risenOnly?: boolean, roleId?: string) : Promise<PlayerStatModel[]> {
    let stats =  await GetLeaderboards(seasonId, risenOnly,  roleId);

    // if role is == ALL we need to combine the stats for all roles
    if(roleId == GameRoles.ALL) {
        console.log("here")
        return combineRoleStatsIntoOneLeaderboard(stats);
    }
    return stats.playerStats;
}


function combineRoleStatsIntoOneLeaderboard(stats: GetLeaderboardResponse) {
    let flattenedLeaderboard: Map<String, PlayerStatModel> = new Map();
    for (let playerStat of stats.playerStats) {
        if (!flattenedLeaderboard.has(playerStat.playerPuuid)) {
            flattenedLeaderboard.set(playerStat.playerPuuid, playerStat);
        } else {
            flattenedLeaderboard.set(playerStat.playerPuuid, combine(playerStat, flattenedLeaderboard.get(playerStat.playerPuuid) as PlayerStatModel))
        }
    }
    return Array.from(flattenedLeaderboard.values());
}

export async function GetLeaderboards(seasonId?: number, risenOnly?: boolean, roleId?: string): Promise<GetLeaderboardResponse> {
    const role = GameRoles[roleId as keyof typeof GameRoles];
    return await MakeBackendCall<PlayerChampionStatsRequest>(`/api/stats/leaderboards/`, "POST", {seasonId, risenOnly, roleId: role}) as GetLeaderboardResponse;
}
