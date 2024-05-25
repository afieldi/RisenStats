import { ALL_TOURNAMENT_GAMES_ID, ensureConnection } from './dbConnect';
import { GameRoles } from '../../../Common/Interface/General/gameEnums';
import { FindManyOptions, MoreThanOrEqual } from 'typeorm';
import { combine } from '../../../Common/utils';
import AggregatedPlayerStatModel from '../../../Common/models/aggregatedplayerstat.model';
import logger from '../../logger';


// TODO for later:
// Make a selector in the LB page for season/role
// Dont allow for all risen
// seasonId must be a real season
// role must be a real role
export async function GetDbLeaderboardsBySeasonIdAndRole(seasonId: number, roleId: GameRoles): Promise<AggregatedPlayerStatModel[]> {
  await ensureConnection();

  // We dont check for game count here since the DB is split by champions, we need to wait for everything to be
  //  aggregated before we can filter by game count
  let searchFilter: FindManyOptions<AggregatedPlayerStatModel> = { where: { seasonId: seasonId } };

  // If gamerole is ALL return all roles and we will aggregate below.
  if (roleId !== GameRoles.ALL) {
    searchFilter['where'] = {
      ...searchFilter['where'],
      lobbyPosition: GameRoles[roleId]
    };
  }

  let leaderboard: AggregatedPlayerStatModel[] = await AggregatedPlayerStatModel.find(searchFilter);
  // If the role is ALL combine the data into one object and return it.
  let flattenedLeaderboard = flattenLeaderboard(leaderboard);
  logger.info(flattenedLeaderboard.length);
  return flattenedLeaderboard;
}

function flattenLeaderboard(playerStatsModel: AggregatedPlayerStatModel[]) {
  let flattenedLeaderboard: Map<String, AggregatedPlayerStatModel> = new Map();

  for (let playerStat of playerStatsModel) {
    let key = `${playerStat.playerPuuid}`;
    if (!flattenedLeaderboard.has(key)) {
      flattenedLeaderboard.set(key, playerStat);
    } else {
      flattenedLeaderboard.set(key, combine(playerStat, flattenedLeaderboard.get(key) as AggregatedPlayerStatModel));
    }
  }

  return Array.from(flattenedLeaderboard.values());
}