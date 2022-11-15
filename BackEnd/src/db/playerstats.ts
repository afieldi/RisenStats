import {ensureConnection} from "./dbConnect";
import PlayerStatModel from "../../../Common/models/playerstat.model";
import {GameRoles} from "../../../Common/Interface/General/gameEnums";
import {FindManyOptions, IsNull, MoreThan, Not} from "typeorm";

export async function GetDbPlayerStatsByPlayerPuuid(playerPuuid: string, seasonId?: number, roleId?: GameRoles, risenOnly?: boolean): Promise<PlayerStatModel[]> {
    await ensureConnection();
    const searchFilter: FindManyOptions<PlayerStatModel> = {where: {playerPuuid: playerPuuid}};
    if (seasonId) {
        searchFilter['where'] = {
            ...searchFilter['where'],
            seasonId: seasonId
        };
    }
    else if (risenOnly) {
        searchFilter['where'] = {
            ...searchFilter['where'],
            seasonId: Not(IsNull()),
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