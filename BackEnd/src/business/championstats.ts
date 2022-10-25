import { GetAveragesFromObjects, ObjectArrayToCsv } from "../../../Common/utils";
import { GetDbPlayerGamesBySeasonId } from "../db/games";
import championMap from '../../data/champions_map.json';
import PlayerGameModel from "../../../Common/models/playergame.model";
import log from "../../logger";

const averageHeaders = [
  "kills", "deaths", "assists", "goldEarned", "totalMinionsKilled",
  "neutralMinionsKilled", "totalDamageDealtToChampions", 'totalDamageTaken', "damageSelfMitigated",
  "totalHeal", "visionScore", "wardsPlaced", "wardsKilled",
  "visionWardsBoughtInGame", "damageDealtToObjectives", "firstBloodKill", "firstBloodAssist",
  "firstTowerKill", "firstTowerAssist", "turretKills", "doubleKills", "tripleKills", "quadraKills",
  "pentaKills", "damagePerGold", "soloKills", "win"
]

export async function GetChampionStatsBySeason(seasonId: string): Promise<string> {
  const seasonGames = await GetDbPlayerGamesBySeasonId(seasonId);
  log.debug(`Found ${seasonGames.length} games`);
  const games: {[key: number]: PlayerGameModel[]} = {};
  for (const game of seasonGames) {
    if (!games[game.championId]) {
      games[game.championId] = [];
    }
    games[game.championId].push(game);
  }

  const averages = [];
  for (const championId in games) {
    const tmp: {[key: string]: any} = GetAveragesFromObjects(games[championId], averageHeaders);
    tmp["name"] = championMap[String(championId) as keyof typeof championMap];
    tmp["gamesPlayed"] = games[championId].length;
    averages.push(tmp);
  }

  // const averages = GetAveragesFromObjects(seasonGames, averageHeaders);
  return ObjectArrayToCsv(Object.values(averages), averageHeaders);
}
