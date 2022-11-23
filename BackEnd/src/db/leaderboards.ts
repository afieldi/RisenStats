import {ALL_RISEN_GAMES_ID, ALL_TOURNAMENT_GAMES_ID, ensureConnection} from "./dbConnect";
import PlayerStatModel from "../../../Common/models/playerstat.model";
import {GameRoles} from "../../../Common/Interface/General/gameEnums";
import {FindManyOptions,  MoreThanOrEqual} from "typeorm";
import {combine} from "../../../Common/utils";

const minAmountOfGames = 4

export async function GetDbLeaderboards(seasonId?: number, roleId?: GameRoles, risenOnly?: boolean): Promise<PlayerStatModel[]> {
    await ensureConnection();

    let searchFilter: FindManyOptions<PlayerStatModel> = {where: {seasonId: ALL_TOURNAMENT_GAMES_ID}};
    if (roleId != GameRoles.ALL) {
        searchFilter = {where: {seasonId: ALL_TOURNAMENT_GAMES_ID, games: MoreThanOrEqual(minAmountOfGames)}};
    }

    if (seasonId) {
        searchFilter['where'] = {
            ...searchFilter['where'],
            seasonId: seasonId
        };
    }
    else if (risenOnly) {
        searchFilter['where'] = {
            ...searchFilter['where'],
            seasonId: ALL_RISEN_GAMES_ID,
        };
    }
    if (roleId && roleId !== GameRoles.ALL) {
        searchFilter['where'] = {
            ...searchFilter['where'],
            lobbyPosition: GameRoles[roleId]
        };
    }

    let leaderboard: PlayerStatModel[] = await PlayerStatModel.find(searchFilter)
    // If the role is ALL combine the data into one object and return it.
    if (roleId == GameRoles.ALL) {
       return flattenLeaderboard(leaderboard);
    }

    return leaderboard;
}

function flattenLeaderboard(playerStatsModel: PlayerStatModel[]) {
    let flattenedLeaderboard: Map<String, PlayerStatModel> = new Map();
    for (let playerStat of playerStatsModel) {
        if (!flattenedLeaderboard.has(playerStat.playerPuuid)) {
            flattenedLeaderboard.set(playerStat.playerPuuid, playerStat);
        } else {
            flattenedLeaderboard.set(playerStat.playerPuuid, combine(playerStat, flattenedLeaderboard.get(playerStat.playerPuuid) as PlayerStatModel))
        }
    }

    // Since we cant garuntee that N > 4 for ALL we need to filter
    return Array.from(flattenedLeaderboard.values()).filter(playerStatModel => playerStatModel.games >= minAmountOfGames);
}