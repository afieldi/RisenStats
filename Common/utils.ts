import PlayerGameModel from "./models/playergame.model";
import { RiotParticipantDto } from "./Interface/RiotAPI/RiotApiDto";
import * as RiotEvents from './Interface/RiotAPI/RiotApiTimelineEvents';
import PlayerChampionStatsModel from "./models/playerchampionstats.model";
import PlayerStatModel from "./models/playerstat.model";

export function toSearchName(name: string): string
{
  name = name.toLowerCase();
  name = name.replace(new RegExp(" ", 'g'), "");
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
  if (data.totalGames === data.totalWins) {
    return 100;
  }
  return roundTo(data.totalWins*100/data.totalGames, rounded);
}

export function calculateChampionKDA(data: PlayerChampionStatsModel, decimals: number = 2): number
{
  if (+data.totalDeaths === 0) return +data.totalKills + +data.totalAssists;
  return roundTo((+data.totalKills + +data.totalAssists) / +data.totalDeaths, decimals);
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

export function GameTypeToString(gameType: number, seasonId: number): string
{
  if (seasonId)
  {
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
  // let dataString = "";
  // if (headers) {
  //   dataString = headers.join(",") + "\n";
  // }
  // return dataString + objects.map(row => row.join(",")).join("\n");
  const dictionaryKeys = Object.keys(objects[0]);
  dictionaryKeys.splice(dictionaryKeys.indexOf("name"), 1);
  dictionaryKeys.splice(0, 0, "name");

  const dictValuesAsCsv = objects.map(dict => (
    dictionaryKeys.map(key => dict[key]).join(',')
  ));

  return [dictionaryKeys.join(','), ...dictValuesAsCsv].join('\n');
}

export function combine(object1: PlayerStatModel, object2: PlayerStatModel): PlayerStatModel {
  for (const key in object1) {
    // @ts-ignore Typescript being stupid here. Just let me do this
    object1[key] += NonNone(object2[key], 0);
  }
  return object1;
}