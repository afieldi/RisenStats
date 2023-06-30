import { ALL_RISEN_GAMES_ID, ensureConnection } from './dbConnect';
import { GameRoles } from '../../../Common/Interface/General/gameEnums';
import { FindManyOptions } from 'typeorm';
import AggregatedPlayerStatModel from '../../../Common/models/aggregatedplayerstat.model';

export async function GetDbAggregatedPlayerStatsByPlayerPuuid(playerPuuid: string, teamId?: number, championId?: number, seasonId?: number, roleId?: GameRoles): Promise<AggregatedPlayerStatModel[]> {
  await ensureConnection();
  const searchFilter: FindManyOptions<AggregatedPlayerStatModel> = { where: { playerPuuid: playerPuuid, seasonId: ALL_RISEN_GAMES_ID } };
  if (championId) {
    searchFilter['where'] = {
      ...searchFilter['where'],
      championId: championId
    };
  }

  if(teamId) {
    searchFilter['where'] = {
      ...searchFilter['where'],
      teamTeamId: teamId
    };
  }

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

  return await AggregatedPlayerStatModel.find(searchFilter);
}