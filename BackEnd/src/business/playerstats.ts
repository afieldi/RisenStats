import { getDbPlayerByname } from "../db/player";
import PlayerModel from "../../../Common/models/player.model";
import PlayerGameModel from "../../../Common/models/playergame.model";
import { GetAveragesFromObjects, NestedArrayToCsv } from "../../../Common/utils";
import { GetDbPlayerGamesByPlayerPuuid } from "../db/games";

const tableCombineCols = [
  "kills", "deaths", "assists", "goldEarned", "totalMinionsKilled",
  "neutralMinionsKilled", "totalDamageDealtToChampions", 'totalDamageTaken', "damageSelfMitigated",
  "totalHeal", "visionScore", "wardsPlaced", "wardsKilled",
  "visionWardsBoughtInGame", "damageDealtToObjectives", "firstBloodKill", "firstBloodAssist",
  "firstTowerKill", "firstTowerAssist", "turretKills", "doubleKills", "tripleKills", "quadraKills",
  "pentaKills", "damagePerGold", "soloKills"
]

export async function GeneratePlayersCsv(playerNames: string[], games: number = 20): Promise<string> {
  const items: any[] = [];
  for (const playerName of playerNames) {
    const playerObj = await getDbPlayerByname(playerName);
    items.push(await GeneratePlayerRow(playerObj, games));
  }
  return NestedArrayToCsv(items, tableCombineCols);
}

export async function GeneratePlayerRow(playerObject: PlayerModel, games: number = 20): Promise<{ [key: string]: any }> {
  const dbGames = await GetDbPlayerGamesByPlayerPuuid(playerObject.puuid, false, games);
  const averages: { [key: string]: any } = GetAveragesFromObjects(dbGames, tableCombineCols);
  averages["name"] = playerObject.name;
  averages["totalGames"] = dbGames.length;
  return averages;
}