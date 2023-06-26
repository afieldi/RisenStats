import { getDbPlayerByname, GetDbPlayerByPuuid, GetPlayerPuuidsInSeason } from '../db/player';
import { GetAveragesFromObjects, ObjectArrayToCsv } from '../../../Common/utils';
import PlayerModel from '../../../Common/models/player.model';
import { GameRoles } from '../../../Common/Interface/General/gameEnums';
import { GetDbPlayerGamesByPlayerPuuid } from '../db/games';

const tableCombineCols = [
  'kills', 'deaths', 'assists', 'kills15', 'deaths15', 'assists15', 'goldEarned', 'totalMinionsKilled',
  'neutralMinionsKilled', 'totalDamageDealtToChampions', 'totalDamageTaken', 'damageSelfMitigated',
  'totalHeal', 'visionScore', 'wardsPlaced', 'wardsKilled',
  'visionWardsBoughtInGame', 'damageDealtToObjectives', 'firstBloodKill', 'firstBloodAssist',
  'killDiff', 'killDiff15', 'killDiff25','assistDiff','assistDiff15','assistDiff25','deathDiff',
  'deathDiff15','deathDiff25','goldDiff','goldDiff15','goldDiff25','csDiff','csDiff15',
  'csDiff25','xpDiff','xpDiff15','xpDiff25',
  'firstTowerKill', 'firstTowerAssist', 'turretKills', 'doubleKills', 'tripleKills', 'quadraKills',
  'pentaKills', 'damagePerGold', 'soloKills', 'gameLength', 'baronTakedowns'
];

export async function GeneratePlayersCsv(playerNames: string[], games: number = 20): Promise<string> {
  const items: any[] = [];
  for (const playerName of playerNames) {
    const playerObj = await getDbPlayerByname(playerName);
    items.push(await GeneratePlayerRow(playerObj, games));
  }
  return ObjectArrayToCsv(items, tableCombineCols);
}

export async function GeneratePlayerRow(playerObject: PlayerModel, games: number = 20, seasonId?: number, roleId?: GameRoles): Promise<{ [key: string]: any }> {
  const dbGames = await GetDbPlayerGamesByPlayerPuuid(playerObject.puuid, false, seasonId, games, 0, roleId);
  const averages: { [key: string]: any } = GetAveragesFromObjects(dbGames, tableCombineCols);
  averages.name = playerObject.name;
  averages.totalGames = dbGames.length;
  return averages;
}

export async function GeneratePlayersCsvByFilter(seasonId: number, risenOnly: boolean, roleId?: GameRoles): Promise<string> {
  const items: any[] = [];

  const players = await GetPlayerPuuidsInSeason(seasonId, roleId, risenOnly);
  for (const player of players) {
    const playerObj = await GetDbPlayerByPuuid(player.playerPuuid);
    items.push(await GeneratePlayerRow(playerObj, 0, seasonId, roleId));
  }
  return ObjectArrayToCsv(items, tableCombineCols);
}