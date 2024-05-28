import PlayerGameModel from '../../../../../Common/models/playergame.model';
import { roundTo } from '../../../../../Common/utils';

/**
 * @param games all the games in the league
 * @param keysToUse the keys from PlayerGameModel to use for generating the stats
 */
export function getRisenTeamStatForLeague(games: PlayerGameModel[], keysToUse: (keyof PlayerGameModel)[]): Map<number, number> {
  const statMap = new Map<number, number>();

  for (let game of games) {
    let val = keysToUse.reduce((sum, key) => sum + (game[key] as number), 0);
    let risenTeamId = game.risenTeamTeamId;
    if (risenTeamId == null) {
      continue;
    }
    statMap.set(risenTeamId, statMap.has(risenTeamId) ? statMap.get(game.risenTeamTeamId) as number + val: val);
  }

  return statMap;
}

export function getRisenTeamGameCountForLeague(games: PlayerGameModel[]): Map<number, number> {
  const gameCount = new Map<number, number>();

  for (let game of games) {
    let risenTeamId = game.risenTeamTeamId;
    gameCount.set(risenTeamId, gameCount.has(risenTeamId) ? gameCount.get(game.risenTeamTeamId) as number + 1: 1);
  }

  return gameCount;
}

export function sortRisenTeamStatEntriesDescending(leaderboardStats: Map<number, number>, howManyToDisplay: number, gameCounts: Map<number,number>): [number, number][] {
  return [...leaderboardStats.entries()]
    .sort((a, b) => {
      const  totalAmountOfGamesB = gameCounts.get(b[0]) as number;
      const  totalAmountOfGamesA = gameCounts.get(a[0]) as number;
      return (b[1]/totalAmountOfGamesB) - (a[1]/totalAmountOfGamesA);
    })
    .slice(0, howManyToDisplay);
}

export function sortRisenTeamStatEntriesAscending(leaderboardStats: Map<number, number>, howManyToDisplay: number, gameCounts: Map<number, number>): [number, number][] {
  return [...leaderboardStats.entries()]
    .sort((a, b) => {
      const totalAmountOfGamesA = gameCounts.get(a[0]) as number;
      const totalAmountOfGamesB = gameCounts.get(b[0]) as number;
      return (a[1] / totalAmountOfGamesA) - (b[1] / totalAmountOfGamesB);
    })
    .slice(0, howManyToDisplay);
}

export function getDisplayValueForTeamLeaderboardForAverage(value: number, teamId: number, gameCountMap: Map<number, number>) {
  return roundTo((value / (gameCountMap.get(teamId) as number)) * 5);
}