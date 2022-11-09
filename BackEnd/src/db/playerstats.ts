import {ensureConnection} from "./dbConnect";
import PlayerStatModel from "../../../Common/models/playerstat.model";
import {GameRoles} from "../../../Common/Interface/General/gameEnums";
import {FindManyOptions} from "typeorm";

export async function GetDbPlayerStatsByPlayerPuuid(playerPuuid: string, seasonId?: number, roleId?: GameRoles): Promise<PlayerStatModel[]> {
    await ensureConnection();
    const searchFilter: FindManyOptions<PlayerStatModel> = {where: {playerPuuid: playerPuuid}};
    if (seasonId) {
        searchFilter['where'] = {
            ...searchFilter['where'],
            seasonId: seasonId
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