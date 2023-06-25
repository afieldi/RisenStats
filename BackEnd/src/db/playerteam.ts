import { ensureConnection } from './dbConnect';
import { FindManyOptions } from 'typeorm';
import PlayerTeamModel from '../../../Common/models/playerteam.model';

export async function getDbPlayerTeamPlayerPuuid(playerPuuid: string, seasonId: number): Promise<number> {
  await ensureConnection();
    
  const searchFilter: FindManyOptions<PlayerTeamModel> = { where: { playerPuuid: playerPuuid, seasonId: seasonId } };
  let playerTeam = await PlayerTeamModel.findOne(searchFilter);
  // playerTeams wont return anything if we pass in the ALL_RISEN_SEASON_ID
  if (!playerTeam) {
    return null;
  }

  return playerTeam.teamId;
}
