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
  object1.games += object2.games;
  object1.kills += NonNone(object2.kills, 0);
  object1.deaths += NonNone(object2.deaths, 0);
  object1.assists += NonNone(object2.assists, 0);
  object1.champLevel += NonNone(object2.champLevel, 0);
  object1.win += NonNone(object2.win);
  object1.kills15 += NonNone(object2.kills15, 0);
  object1.deaths15 += NonNone(object2.deaths15, 0);
  object1.assists15 += NonNone(object2.assists15, 0);
  object1.goldEarned += NonNone(object2.goldEarned, 0);
  object1.goldSpent += NonNone(object2.goldSpent, 0);
  object1.totalMinionsKilled += NonNone(object2.totalMinionsKilled, 0);
  object1.neutralMinionsKilled += NonNone(object2.neutralMinionsKilled, 0);
  object1.physicalDamageDealtToChampions += NonNone(object2.physicalDamageDealtToChampions, 0);
  object1.magicDamageDealtToChampions += NonNone(object2.magicDamageDealtToChampions, 0);
  object1.trueDamageDealtToChampions += NonNone(object2.trueDamageDealtToChampions, 0);
  object1.totalDamageDealtToChampions += NonNone(object2.totalDamageDealtToChampions, 0);
  object1.physicalDamageTaken += NonNone(object2.physicalDamageTaken, 0);
  object1.magicalDamageTaken += NonNone(object2.magicalDamageTaken, 0);
  object1.trueDamageTaken += NonNone(object2.trueDamageTaken, 0);
  object1.totalDamageTaken += NonNone(object2.totalDamageTaken, 0);
  object1.damageSelfMitigated += NonNone(object2.damageSelfMitigated, 0);
  object1.totalHeal += NonNone(object2.totalHeal, 0);
  object1.totalHealsOnTeammates += NonNone(object2.totalHealsOnTeammates, 0);
  object1.totalDamageShieldedOnTeammates += NonNone(object2.totalDamageShieldedOnTeammates, 0);
  object1.visionScore += NonNone(object2.visionScore, 0);
  object1.wardsPlaced15 += NonNone(object2.wardsPlaced15, 0);
  object1.wardsPlaced += NonNone(object2.wardsPlaced, 0);
  object1.wardsKilled15 += NonNone(object2.wardsKilled15, 0);
  object1.wardsKilled += NonNone(object2.wardsKilled, 0);
  object1.visionWardsBoughtInGame += NonNone(object2.visionWardsBoughtInGame, 0);
  object1.damageDealtToObjectives += NonNone(object2.damageDealtToObjectives, 0);
  object1.dragonKills += NonNone(object2.dragonKills, 0);
  object1.firstTowerTakedown += NonNone(object2.firstTowerTakedown);
  object1.firstBloodTakedown += NonNone(object2.firstBloodTakedown);
  object1.firstBloodKill += NonNone(object2.firstBloodKill);
  object1.firstBloodAssist += NonNone(object2.firstBloodAssist);
  object1.firstTowerKill += NonNone(object2.firstTowerKill);
  object1.firstTowerAssist += NonNone(object2.firstTowerAssist);
  object1.turretKills += NonNone(object2.turretKills, 0);
  object1.doubleKills += NonNone(object2.doubleKills, 0);
  object1.tripleKills += NonNone(object2.tripleKills, 0);
  object1.quadraKills += NonNone(object2.quadraKills, 0);
  object1.pentaKills += NonNone(object2.pentaKills, 0);
  object1.consumablesPurchased += NonNone(object2.consumablesPurchased, 0);
  object1["12AssistStreakCount"] += NonNone(object2["12AssistStreakCount"], 0);
  object1.abilityUses += NonNone(object2.abilityUses, 0);
  object1.acesBefore15Minutes += NonNone(object2.acesBefore15Minutes, 0);
  object1.alliedJungleMonsterKills += NonNone(object2.alliedJungleMonsterKills, 0);
  object1.baronTakedowns += NonNone(object2.baronTakedowns, 0);
  object1.blastConeOppositeOpponentCount += NonNone(object2.blastConeOppositeOpponentCount, 0);
  object1.bountyGold += NonNone(object2.bountyGold, 0);
  object1.buffsStolen += NonNone(object2.buffsStolen, 0);
  object1.completeSupportQuestInTime += NonNone(object2.completeSupportQuestInTime);
  object1.controlWardTimeCoverageInRiverOrEnemyHalf += NonNone(object2.controlWardTimeCoverageInRiverOrEnemyHalf, 0);
  object1.controlWardsPlaced += NonNone(object2.controlWardsPlaced, 0);
  object1.damagePerMinute += NonNone(object2.damagePerMinute, 0);
  object1.damageTakenOnTeamPercentage += NonNone(object2.damageTakenOnTeamPercentage, 0);
  object1.dancedWithRiftHerald += NonNone(object2.dancedWithRiftHerald);
  object1.deathsByEnemyChamps += NonNone(object2.deathsByEnemyChamps, 0);
  object1.dodgeSkillShotsSmallWindow += NonNone(object2.dodgeSkillShotsSmallWindow, 0);
  object1.doubleAces += NonNone(object2.doubleAces, 0);
  object1.dragonTakedowns += NonNone(object2.dragonTakedowns, 0);
  object1.earliestBaron += NonNone(object2.earliestBaron, 0);
  object1.earliestDragonTakedown += NonNone(object2.earliestDragonTakedown, 0);
  object1.earlyLaningPhaseGoldExpAdvantage += NonNone(object2.earlyLaningPhaseGoldExpAdvantage, 0);
  object1.effectiveHealAndShielding += NonNone(object2.effectiveHealAndShielding, 0);
  object1.elderDragonKillsWithOpposingSoul += NonNone(object2.elderDragonKillsWithOpposingSoul, 0);
  object1.elderDragonMultikills += NonNone(object2.elderDragonMultikills, 0);
  object1.enemyChampionImmobilizations += NonNone(object2.enemyChampionImmobilizations, 0);
  object1.enemyJungleMonsterKills += NonNone(object2.enemyJungleMonsterKills, 0);
  object1.epicMonsterKillsNearEnemyJungler += NonNone(object2.epicMonsterKillsNearEnemyJungler, 0);
  object1.epicMonsterKillsWithin30SecondsOfSpawn += NonNone(object2.epicMonsterKillsWithin30SecondsOfSpawn, 0);
  object1.epicMonsterSteals += NonNone(object2.epicMonsterSteals, 0);
  object1.epicMonsterStolenWithoutSmite += NonNone(object2.epicMonsterStolenWithoutSmite, 0);
  object1.flawlessAces += NonNone(object2.flawlessAces, 0);
  object1.fullTeamTakedown += NonNone(object2.fullTeamTakedown, 0);
  object1.gameLength += NonNone(object2.gameLength, 0);
  object1.getTakedownsInAllLanesEarlyJungleAsLaner += NonNone(object2.getTakedownsInAllLanesEarlyJungleAsLaner);
  object1.goldPerMinute += NonNone(object2.goldPerMinute, 0);
  object1.hadAfkTeammate += NonNone(object2.hadAfkTeammate);
  object1.hadOpenNexus += NonNone(object2.hadOpenNexus);
  object1.immobilizeAndKillWithAlly += NonNone(object2.immobilizeAndKillWithAlly, 0);
  object1.initialBuffCount += NonNone(object2.initialBuffCount, 0);
  object1.initialCrabCount += NonNone(object2.initialCrabCount, 0);
  object1.jungleCsBefore10Minutes += NonNone(object2.jungleCsBefore10Minutes, 0);
  object1.junglerKillsEarlyJungle += NonNone(object2.junglerKillsEarlyJungle, 0);
  object1.junglerTakedownsNearDamagedEpicMonster += NonNone(object2.junglerTakedownsNearDamagedEpicMonster, 0);
  object1.kTurretsDestroyedBeforePlatesFall += NonNone(object2.kTurretsDestroyedBeforePlatesFall, 0);
  object1.kda += NonNone(object2.kda, 0);
  object1.killAfterHiddenWithAlly += NonNone(object2.killAfterHiddenWithAlly, 0);
  object1.killParticipation += NonNone(object2.killParticipation, 0);
  object1.killedChampTookFullTeamDamageSurvived += NonNone(object2.killedChampTookFullTeamDamageSurvived, 0);
  object1.killsNearEnemyTurret += NonNone(object2.killsNearEnemyTurret, 0);
  object1.killsOnLanersEarlyJungleAsJungler += NonNone(object2.killsOnLanersEarlyJungleAsJungler, 0);
  object1.killsOnOtherLanesEarlyJungleAsLaner += NonNone(object2.killsOnOtherLanesEarlyJungleAsLaner, 0);
  object1.killsOnRecentlyHealedByAramPack += NonNone(object2.killsOnRecentlyHealedByAramPack, 0);
  object1.killsUnderOwnTurret += NonNone(object2.killsUnderOwnTurret, 0);
  object1.killsWithHelpFromEpicMonster += NonNone(object2.killsWithHelpFromEpicMonster, 0);
  object1.knockEnemyIntoTeamAndKill += NonNone(object2.knockEnemyIntoTeamAndKill, 0);
  object1.landSkillShotsEarlyGame += NonNone(object2.landSkillShotsEarlyGame, 0);
  object1.laneMinionsFirst10Minutes += NonNone(object2.laneMinionsFirst10Minutes, 0);
  object1.laningPhaseGoldExpAdvantage += NonNone(object2.laningPhaseGoldExpAdvantage, 0);
  object1.legendaryCount += NonNone(object2.legendaryCount, 0);
  object1.lostAnInhibitor += NonNone(object2.lostAnInhibitor, 0);
  object1.maxCsAdvantageOnLaneOpponent += NonNone(object2.maxCsAdvantageOnLaneOpponent, 0);
  object1.maxKillDeficit += NonNone(object2.maxKillDeficit, 0);
  object1.maxLevelLeadLaneOpponent += NonNone(object2.maxLevelLeadLaneOpponent, 0);
  object1.moreEnemyJungleThanOpponent += NonNone(object2.moreEnemyJungleThanOpponent, 0);
  object1.multiKillOneSpell += NonNone(object2.multiKillOneSpell, 0);
  object1.multiTurretRiftHeraldCount += NonNone(object2.multiTurretRiftHeraldCount, 0);
  object1.multikills += NonNone(object2.multikills, 0);
  object1.multikillsAfterAggressiveFlash += NonNone(object2.multikillsAfterAggressiveFlash, 0);
  object1.mythicItemUsed += NonNone(object2.mythicItemUsed, 0);
  object1.outerTurretExecutesBefore10Minutes += NonNone(object2.outerTurretExecutesBefore10Minutes, 0);
  object1.outnumberedKills += NonNone(object2.outnumberedKills, 0);
  object1.outnumberedNexusKill += NonNone(object2.outnumberedNexusKill, 0);
  object1.perfectDragonSoulsTaken += NonNone(object2.perfectDragonSoulsTaken, 0);
  object1.perfectGame += NonNone(object2.perfectGame);
  object1.pickKillWithAlly += NonNone(object2.pickKillWithAlly, 0);
  object1.poroExplosions += NonNone(object2.poroExplosions, 0);
  object1.quickCleanse += NonNone(object2.quickCleanse, 0);
  object1.quickFirstTurret += NonNone(object2.quickFirstTurret, 0);
  object1.quickSoloKills += NonNone(object2.quickSoloKills, 0);
  object1.riftHeraldTakedowns += NonNone(object2.riftHeraldTakedowns, 0);
  object1.saveAllyFromDeath += NonNone(object2.saveAllyFromDeath, 0);
  object1.scuttleCrabKills += NonNone(object2.scuttleCrabKills, 0);
  object1.skillshotsDodged += NonNone(object2.skillshotsDodged, 0);
  object1.skillshotsHit += NonNone(object2.skillshotsHit, 0);
  object1.snowballsHit += NonNone(object2.snowballsHit, 0);
  object1.soloBaronKills += NonNone(object2.soloBaronKills, 0);
  object1.soloKills += NonNone(object2.soloKills, 0);
  object1.soloTurretsLategame += NonNone(object2.soloTurretsLategame, 0);
  object1.stealthWardsPlaced += NonNone(object2.stealthWardsPlaced, 0);
  object1.survivedSingleDigitHpCount += NonNone(object2.survivedSingleDigitHpCount, 0);
  object1.survivedThreeImmobilizesInFight += NonNone(object2.survivedThreeImmobilizesInFight, 0);
  object1.takedownOnFirstTurret += NonNone(object2.takedownOnFirstTurret, 0);
  object1.takedowns += NonNone(object2.takedowns, 0);
  object1.takedownsAfterGainingLevelAdvantage += NonNone(object2.takedownsAfterGainingLevelAdvantage, 0);
  object1.takedownsBeforeJungleMinionSpawn += NonNone(object2.takedownsBeforeJungleMinionSpawn, 0);
  object1.takedownsFirst25Minutes += NonNone(object2.takedownsFirst25Minutes, 0);
  object1.takedownsInAlcove += NonNone(object2.takedownsInAlcove, 0);
  object1.takedownsInEnemyFountain += NonNone(object2.takedownsInEnemyFountain, 0);
  object1.teamBaronKills += NonNone(object2.teamBaronKills, 0);
  object1.teamDamagePercentage += NonNone(object2.teamDamagePercentage, 0);
  object1.teamElderDragonKills += NonNone(object2.teamElderDragonKills, 0);
  object1.teamRiftHeraldKills += NonNone(object2.teamRiftHeraldKills, 0);
  object1.teleportTakedowns += NonNone(object2.teleportTakedowns, 0);
  object1.threeWardsOneSweeperCount += NonNone(object2.threeWardsOneSweeperCount, 0);
  object1.tookLargeDamageSurvived += NonNone(object2.tookLargeDamageSurvived, 0);
  object1.turretPlatesTaken += NonNone(object2.turretPlatesTaken, 0);
  object1.turretTakedowns += NonNone(object2.turretTakedowns, 0);
  object1.turretsTakenWithRiftHerald += NonNone(object2.turretsTakenWithRiftHerald, 0);
  object1.twentyMinionsIn3SecondsCount += NonNone(object2.twentyMinionsIn3SecondsCount, 0);
  object1.unseenRecalls += NonNone(object2.unseenRecalls, 0);
  object1.visionScoreAdvantageLaneOpponent += NonNone(object2.visionScoreAdvantageLaneOpponent, 0);
  object1.visionScorePerMinute += NonNone(object2.visionScorePerMinute, 0);
  object1.wardTakedowns += NonNone(object2.wardTakedowns, 0);
  object1.wardTakedownsBefore20M += NonNone(object2.wardTakedownsBefore20M, 0);
  object1.wardsGuarded += NonNone(object2.wardsGuarded, 0);
  object1.xpDiff += NonNone(object2.xpDiff, 0);
  object1.xpDiff15 += NonNone(object2.xpDiff15, 0);
  object1.xpDiff25 += NonNone(object2.xpDiff25, 0);
  object1.goldDiff += NonNone(object2.goldDiff, 0);
  object1.goldDiff15 += NonNone(object2.goldDiff15, 0);
  object1.goldDiff25 += NonNone(object2.goldDiff25, 0);
  object1.csDiff += NonNone(object2.csDiff, 0);
  object1.csDiff15 += NonNone(object2.csDiff15, 0);
  object1.csDiff25 += NonNone(object2.csDiff25, 0);
  object1.totalKillsOfTeam += NonNone(object2.totalKillsOfTeam, 0);
  object1.totalDeathsOfTeam += NonNone(object2.totalDeathsOfTeam, 0);
  object1.totalAssistsOfTeam += NonNone(object2.totalAssistsOfTeam, 0);
  object1.totalDamageDealtToObjectivesOfTeam += NonNone(object2.totalDamageDealtToObjectivesOfTeam, 0);
  object1.totalGoldOfTeam += NonNone(object2.totalGoldOfTeam, 0);
  object1.totalPhysicalDamageDealtToChampionsOfTeam += NonNone(object2.totalPhysicalDamageDealtToChampionsOfTeam, 0);
  object1.totalMagicDamageDealtToChampionsOfTeam += NonNone(object2.totalMagicDamageDealtToChampionsOfTeam, 0);
  object1.totalTrueDamageDealtToChampionsOfTeam += NonNone(object2.totalTrueDamageDealtToChampionsOfTeam, 0);
  object1.totalDamageDealtToChampionsOfTeam += NonNone(object2.totalDamageDealtToChampionsOfTeam, 0);
  object1.totalVisionScoreOfTeam += NonNone(object2.totalVisionScoreOfTeam, 0);
  return object1;
}