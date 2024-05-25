import { GameRoles } from '../../../Common/Interface/General/gameEnums';
import AggregatedPlayerStatModel from '../../../Common/models/aggregatedplayerstat.model';
import { GetDbLeaderboardsBySeasonIdAndRole } from '../db/leaderboards';

const BASE_MIN_NUMBER_OF_GAMES = 4;

export async function GetLeaderboardsBySeasonIdAndRole(seasonId: number, roleId: GameRoles): Promise<AggregatedPlayerStatModel[]> {
  let flattenedLeaderboard = await GetDbLeaderboardsBySeasonIdAndRole(seasonId, roleId);

  let minGames = BASE_MIN_NUMBER_OF_GAMES;

  // Early in the season there will always be not enough games to satisfy the min count, so in this case we use the average so the early weeks have leaderboards.
  let averageGames = Math.round(flattenedLeaderboard.reduce((sum, player) => sum + player.games, 0) / flattenedLeaderboard.length);
  if (averageGames < BASE_MIN_NUMBER_OF_GAMES) {
    minGames = averageGames;
  }

  return flattenedLeaderboard.filter(playerStatModel => playerStatModel.games >= minGames);
}