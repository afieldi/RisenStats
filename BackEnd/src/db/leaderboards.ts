import {ALL_RISEN_GAMES_ID, ALL_TOURNAMENT_GAMES_ID, ensureConnection} from "./dbConnect";
import PlayerStatModel from "../../../Common/models/playerstat.model";
import {GameRoles} from "../../../Common/Interface/General/gameEnums";
import {FindManyOptions, MoreThan} from "typeorm";

export async function GetDbLeaderboards(seasonId?: number, roleId?: GameRoles, risenOnly?: boolean): Promise<PlayerStatModel[]> {
    await ensureConnection();

    let searchFilter: FindManyOptions<PlayerStatModel> = {where: {seasonId: ALL_TOURNAMENT_GAMES_ID}};
    if (roleId != GameRoles.ALL) {
        searchFilter = {where: {seasonId: ALL_TOURNAMENT_GAMES_ID, games: MoreThan(4)}};
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

    return await PlayerStatModel.find(searchFilter);
}