import PlayerGameModel from "./models/playergame.model";
import { RiotParticipantDto } from "./Interface/RiotAPI/RiotApiDto";
import * as RiotEvents from './Interface/RiotAPI/RiotApiTimelineEvents';
import SeasonModel from "./models/season.model";
import AggregatedPlayerStatModel from "./models/aggregatedplayerstat.model";
import { GameRoles } from "./Interface/General/gameEnums";

export function toSearchName(name: string, tag?: string): string
{
  name = name.toLowerCase();
  name = name.replace(new RegExp(" ", 'g'), "");
  if (tag) {
    name += '-' + tag;
  }
  return name;
}

export function riotTimestampToSeconds(time: number): number
{
  return time;
}

export function riotTimestampToMinutes(time: number): number
{
  return riotTimestampToSeconds(time) / 60;
}

export function riotTimelineTimestampToMinutes(time: number): number
{
  return riotTimestampToMinutes(time / 1000);
}

export function riotTimestampToGameTime(time: number): string
{
  let s = riotTimestampToSeconds(time);
  let min = Math.floor(s / 60);
  s -= min * 60;

  return `${min}:${String(Math.round(s)).padStart(2, '0')}`;
}

export function timeToTimeAgo(time: number): string {

  var msPerMinute = 60 * 1000;
  var msPerHour = msPerMinute * 60;
  var msPerDay = msPerHour * 24;
  var msPerMonth = msPerDay * 30;
  var msPerYear = msPerDay * 365;

  var elapsed = Date.now() - (riotTimestampToSeconds(time));
  if (elapsed < msPerMinute) {
    return Math.round(elapsed/1000) + ' seconds ago';
  }

  else if (elapsed < msPerHour) {
    return Math.round(elapsed/msPerMinute) + ' minutes ago';
  }

  else if (elapsed < msPerDay ) {
    return Math.round(elapsed/msPerHour ) + ' hours ago';
  }

  else if (elapsed < msPerMonth) {
    return Math.round(elapsed/msPerDay) + ' days ago';
  }

  else if (elapsed < msPerYear) {
    return  Math.round(elapsed/msPerMonth) + ' months ago';
  }

  return Math.round(elapsed/msPerYear) + ' years ago';

}

export function splitNameTagLine(name?: string): string[] {
  if (!name) {
    return ['', ''];
  }
  const [gameName, tag] = name.split('#');

  // If there is no tag, also try splitting by -. We use both to split due to - working better in urls.
  if (!tag) {
    return name.split('-');
  }
  return [gameName, tag];
}

export function toPerMinute(value: number, riotTimestamp: number, rounded: number = 2): number {
  let m = riotTimestampToMinutes(riotTimestamp);
  return roundTo(value / m, rounded);
}

export function roundTo(r: number, decimals: number = 2): number
{
  if (decimals == 0) {
    return Math.round(r);
  }
  let factor = 10 * decimals;
  r *= factor;
  r = Math.round(r);
  return r / factor;
}

interface KDAProps {
  kills: number;
  assists: number;
  deaths: number;
}

export function calculateKDA(data: KDAProps, decimals: number = 2): number
{
  if (data.deaths === 0) return data.kills + data.assists;
  return roundTo((data.kills + data.assists) / data.deaths, decimals);
}

interface WRProps {
  totalGames: number;
  totalWins: number;
}

export function calculateWR(data: WRProps, rounded = 2): number
{
  if (data.totalGames == 0) {
    return 0;
  }
  if (data.totalGames === data.totalWins) {
    return 100;
  }
  return roundTo(data.totalWins*100/data.totalGames, rounded);
}

export function calculateCS(data: PlayerGameModel): number
{
  return data.totalMinionsKilled + data.neutralMinionsKilled;
}

export function trimStr(s: string, length: number)
{
  return s.substring(0, length);
}

// Kinda convulted but eh
export function EventIsWardPlaced(event: RiotEvents.RiotTimelineEvent): event is RiotEvents.RiotTimelineEventWardPlacedDto
{
  return event.type.toString() === RiotEvents.RiotTimelineEventType.WARD_PLACED.toString();
}

export function EventIsWardKill(event: RiotEvents.RiotTimelineEvent): event is RiotEvents.RiotTimelineEventWardKillDto
{
  return event.type.toString() === RiotEvents.RiotTimelineEventType.WARD_KILL.toString();
}

export function EventIsChampionKill(event: RiotEvents.RiotTimelineEvent): event is RiotEvents.RiotTimelineEventChampionKillDto
{
  return event.type.toString() === RiotEvents.RiotTimelineEventType.CHAMPION_KILL.toString();
}

export function EventIsEliteMonsterKill(event: RiotEvents.RiotTimelineEvent): event is RiotEvents.RiotTimelineEventEliteMonsterKill
{
  return event.type.toString() === RiotEvents.RiotTimelineEventType.ELITE_MONSTER_KILL.toString();
}

export function TotalDamageToChamps(player: PlayerGameModel | RiotParticipantDto)
{
  return player.physicalDamageDealtToChampions + player.magicDamageDealtToChampions + player.trueDamageDealtToChampions;
}

export function ToMatchId(gameId: number): string
{
  return `NA1_${gameId}`;
}

export function ToGameId(matchId: string): number
{
  let split = matchId.split("_");
  return Number(split[1]);
}

export function GameTypeToString(gameType: number, seasonId: number, seasons?: SeasonModel[]): string
{
  if (seasonId)
  {
    if (seasons) {
      for (const season of seasons) {
        if (season.id === seasonId)
          return season.seasonName;
      }
    }
    return "Risen Match"
  }
  if (gameType === 0)
  {
    return "Custom";
  }
  else if (gameType === 430)
  {
    return "Blind Pick";
  }
  else if (gameType === 420)
  {
    return "Solo Queue";
  }
  else if (gameType === 400)
  {
    return "Draft Pick";
  }
  else if (gameType === 440)
  {
    return "Flex Queue";
  }
  else if (gameType === 700)
  {
    return "Clash"
  }
  return "Unknown";
}

export function GetCurrentEpcohMs() {
  return new Date().getTime();
}

export function NonNone(value: number | undefined, def: number = 0) : number
{
  return value ? value : def;
}

export function BoolToNumber(value: Boolean): number {
  return value ? 1 : 0;
}

export function GetAveragesFromObjects(objects: any[], keys: string[]): {[key: string]: number}
{
  if (objects.length === 0) {
    const rValues: {[key: string]: number} = {};
    keys.forEach(key => {
      rValues[key] = 0;
    });
    return rValues;
  }

  const handler = {
    get: function(target: {[key: string]: number}, key: string) {
      return target.hasOwnProperty(key) ? target[key] : 0;
    }
  }
  let averages: {[key: string]: number} = {};
  const proxy = new Proxy(averages, handler);

  objects.map(o => {
    for (const k of keys) {
      proxy[k] += o[k];
    }
  });

  for (const k of keys) {
    proxy[k] /= objects.length;
  }

  return averages;
}

export function ObjectArrayToCsv(objects: { [key: string]: any }[], headers?: string[]): string {
  const dictionaryKeys = Object.keys(objects[0]);
  dictionaryKeys.splice(dictionaryKeys.indexOf("name"), 1);
  dictionaryKeys.splice(0, 0, "name");

  const dictValuesAsCsv = objects.map(dict => (
    dictionaryKeys.map(key => dict[key]).join(',')
  ));

  return [dictionaryKeys.join(','), ...dictValuesAsCsv].join('\n');
}

export function combine(object1: AggregatedPlayerStatModel, object2: AggregatedPlayerStatModel): AggregatedPlayerStatModel {
  const dontCombineKeys = ["player", "playerPuuid", "seasonId", "season", "lobbyPosition", "championId", "team", "teamTeamId"]
  for (const key in object1) {
    if (dontCombineKeys.includes(key)) {
      continue;
    }
    // @ts-ignore Typescript being stupid here. Just let me do this
    object1[key] += NonNone(object2[key], 0);
  }
  return object1;
}

export function sigmoid(z: number, k: number) {
  return 1 / (1 + Math.exp(-z/k));
}

export function doesPlayerStatsObjectHaveData(playerStats: AggregatedPlayerStatModel[]): boolean {
  return !!playerStats.length;
}

export function getTotalCS(playerStatsModel: AggregatedPlayerStatModel | PlayerGameModel): number {
  return playerStatsModel.totalMinionsKilled + playerStatsModel.enemyJungleMonsterKills + playerStatsModel.alliedJungleMonsterKills;
}

export function deepCopy<T>(object: T): T {
  return JSON.parse(JSON.stringify(object)) as T;
}

export function mergePlayerStats(playerStatsWithChampions: AggregatedPlayerStatModel[],
                          keyFnc: (seasonId: number, roleId: GameRoles, teamId: number, championId: number) => string): AggregatedPlayerStatModel[] {

  let mergedPlayerStats: Map<String, AggregatedPlayerStatModel> = new Map<String, AggregatedPlayerStatModel>();

  for (let playerStat of playerStatsWithChampions) {
    const key = keyFnc(playerStat.seasonId, playerStat.lobbyPosition as GameRoles, playerStat.teamTeamId, playerStat.championId);
    if(mergedPlayerStats.has(key)) {
      mergedPlayerStats.set(key, combine(playerStat, mergedPlayerStats.get(key) as AggregatedPlayerStatModel));
    } else {
      mergedPlayerStats.set(key, playerStat);
    }
  }
  return Array.from(mergedPlayerStats.values());
}

export function getSeasonWithLeaguePage(seasons: SeasonModel[], seasonId?: string): SeasonModel {
  if(seasonId == null) {
    return null;
  }
  return seasons.find(season => season.id.toString() === seasonId.toString() && season.googleSheetParserType !== null && season.googleSheetId !== null);
}

export function MakeId(length: number) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}