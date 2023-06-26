import { ALL_RISEN_GAMES_ID, ALL_TOURNAMENT_GAMES_ID, ensureConnection } from './dbConnect';
import PlayerStatModel from '../../../Common/models/playerstat.model';
import { GameRoles } from '../../../Common/Interface/General/gameEnums';
import { FindManyOptions, IsNull, MoreThan, Not } from 'typeorm';
import AggregatedPlayerStatModel from '../../../Common/models/aggregatedplayerstat.model';
import PlayerChampionStatsModel from '../../../Common/models/playerchampionstats.model';

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

// TODO remove this function when the frontend starts using AggregatedPlayerStatModel
export async function GetDBChampionStatsByPlayerPuuid(playerPuuid: string, seasonId?: number, roleId?: GameRoles, risenOnly?: boolean): Promise<PlayerChampionStatsModel[]> {
  await ensureConnection();
  let playerStats = await GetDbAggregatedPlayerStatsByPlayerPuuid(playerPuuid,
    null,
    null,
    seasonId ? seasonId : ( risenOnly ? ALL_RISEN_GAMES_ID : ALL_TOURNAMENT_GAMES_ID ),
    roleId);
  let mergedPlayerStats: Map<String, AggregatedPlayerStatModel> = new Map<String, AggregatedPlayerStatModel>();

  for (let playerStat of playerStats) {
    const key = `${playerPuuid}-${seasonId}-${roleId}-${playerStat.championId}`;
    if(mergedPlayerStats.has(key)) {
      let model = mergedPlayerStats.get(key);
      for (let key of Object.keys(model)) {
        // @ts-ignore
        if(typeof model[key] === 'string') {
          continue;
        }
        // @ts-ignore
        model[key] += playerStat[key];
      }
      mergedPlayerStats.set(key, model);
    } else {
      mergedPlayerStats.set(key, playerStat);
    }
  }

  let playerChampionStatsModels: PlayerChampionStatsModel[] = [];
  for (let mergedPlayerStat of mergedPlayerStats.values()) {
    let model = PlayerChampionStatsModel.create({
      championId: mergedPlayerStat.championId,
      position: mergedPlayerStat.lobbyPosition,
      playerPuuid,
      seasonId: seasonId,
      totalAssists: mergedPlayerStat.assists,
      totalDeaths: mergedPlayerStat.deaths,
      totalKills: mergedPlayerStat.kills,
      totalMinionsKilled: mergedPlayerStat.totalMinionsKilled,
      totalNeutralMinionsKilled: mergedPlayerStat.neutralMinionsKilled,
      totalGames: mergedPlayerStat.games,
      totalWins: mergedPlayerStat.win,
      averageDamageDealt: (mergedPlayerStat.physicalDamageDealtToChampions + mergedPlayerStat.magicDamageDealtToChampions + mergedPlayerStat.trueDamageDealtToChampions) / mergedPlayerStat.games,
      averageDamageTaken: (mergedPlayerStat.physicalDamageTaken + mergedPlayerStat.magicalDamageTaken + mergedPlayerStat.trueDamageTaken) / mergedPlayerStat.games,
      totalDoubleKills: mergedPlayerStat.doubleKills,
      totalTripleKills: mergedPlayerStat.tripleKills,
      totalQuadraKills: mergedPlayerStat.quadraKills,
      totalPentaKills: mergedPlayerStat.pentaKills,
      averageGameDuration: mergedPlayerStat.gameLength / mergedPlayerStat.games,
      averageGoldEarned: mergedPlayerStat.goldEarned / mergedPlayerStat.games
    });
    playerChampionStatsModels.push(model);
  }
  return playerChampionStatsModels;
}