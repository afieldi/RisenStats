import { ALL_RISEN_GAMES_ID, ALL_TOURNAMENT_GAMES_ID, ensureConnection } from './dbConnect';
import { GameRoles } from '../../../Common/Interface/General/gameEnums';
import { FindManyOptions, MoreThanOrEqual } from 'typeorm';
import { combine } from '../../../Common/utils';
import DenylistModel from '../../../Common/models/denylist.model';
import AggregatedPlayerStatModel from '../../../Common/models/aggregatedplayerstat.model';

const minNumberOfGames = 4;

export async function GetDbLeaderboards(seasonId?: number, roleId?: GameRoles, risenOnly?: boolean, collapseRoles?: boolean): Promise<AggregatedPlayerStatModel[]> {
  await ensureConnection();

  let searchFilter: FindManyOptions<AggregatedPlayerStatModel> = { where: { seasonId: ALL_TOURNAMENT_GAMES_ID } };
  if (roleId !== GameRoles.ALL) {
    searchFilter = { where: { seasonId: ALL_TOURNAMENT_GAMES_ID, games: MoreThanOrEqual(minNumberOfGames) } };
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

  let leaderboard: AggregatedPlayerStatModel[] = await AggregatedPlayerStatModel.find(searchFilter);
  // If the role is ALL combine the data into one object and return it.
  return flattenLeaderboard(leaderboard, roleId == GameRoles.ALL || collapseRoles);
}

function flattenLeaderboard(playerStatsModel: AggregatedPlayerStatModel[], collapseRoles?: boolean) {
  let flattenedLeaderboard: Map<String, AggregatedPlayerStatModel> = new Map();
  for (let playerStat of playerStatsModel) {
    let key = playerStat.playerPuuid;
    if (!collapseRoles) {
      // If we don't want to collapse roles, return an entry for each lobby position
      key += '_' + playerStat.lobbyPosition;
    }
    if (!flattenedLeaderboard.has(key)) {
      flattenedLeaderboard.set(key, playerStat);
    } else {
      flattenedLeaderboard.set(key, combine(playerStat, flattenedLeaderboard.get(key) as AggregatedPlayerStatModel));
    }
  }

  // Since we cant garuntee that N > 4 for ALL we need to filter
  return Array.from(flattenedLeaderboard.values()).filter(playerStatModel => playerStatModel.games >= minNumberOfGames);
}

async function removeDenyListPlayers(leaderboard: AggregatedPlayerStatModel[]): Promise<AggregatedPlayerStatModel[]>  {
  let denyListPlayers: DenylistModel[] = await DenylistModel.find({});

  if (denyListPlayers.length === 0) {
    return leaderboard;
  }

  let denyListPuuids: string[] = denyListPlayers.map(denyListPlayer => denyListPlayer.playerPuuid);
  return leaderboard.filter(playerstat => {
    return !denyListPuuids.includes(playerstat.playerPuuid);
  });
}