import { CreateDbGame, CreateDbPlayerGameNoSave, GetDbGameByGameId, GetDbPlayerGamesByGameId } from '../db/games';
import { GameSummaryPlayer, GameSummaryPlayers, TeamSumStat, TeamSumStats } from '../../../Common/Interface/Database/game';
import { RiotMatchDto, RiotParticipantDto } from '../../../Common/Interface/RiotAPI/RiotApiDto';
import GameModel from '../../../Common/models/game.model';
import { ToGameId, ToMatchId, TotalDamageToChamps } from '../../../Common/utils';
import { GetRiotGameByMatchId, GetRiotTimelineByMatchId } from '../external-api/game';
import { ProcessTimeline } from './timeline';
import { BaseEntity } from 'typeorm';
import { CreateDbPlayersWithParticipantData } from '../db/player';
import { SaveObjects } from '../db/dbConnect';
import { GetDbCode } from '../db/codes';
import { GameRoles } from '../../../Common/Interface/General/gameEnums';
import { getSeasonsToUpdate, updateStatsFor } from './playerstats';
import PlayerGameModel from '../../../Common/models/playergame.model';
import logger from '../../logger';
import { getDbPlayerTeamPlayerPuuid } from '../db/playerteam';
import { buildRisenTeams } from './teams';
import { GetDbActiveSeasonWithSheets } from '../db/season';

async function GetGameDataByMatchId(matchId: string): Promise<RiotMatchDto> {
  const gameData = await GetRiotGameByMatchId(matchId);
  if (gameData.info.participants.length !== 10) {
    throw new Error(`Invalid number of participants: ${gameData.info.participants.length}`);
  }
  return gameData;
}

export async function SaveDataByMatchIdForRiotCallback(matchId: string): Promise<GameModel> {
  const existingMatch = await saveMatchForGameAlreadyInDb(matchId);
  // We need this check because sometimes the callback function calls twice for the same match,
  // in that case we dont want to aggregate the stats again.
  if (existingMatch) {
    return existingMatch;
  }

  let savedGameModel = await SaveDataByMatchId(matchId);
  await updatePlayerStatsForGame(matchId);
  return savedGameModel;
}

export async function SaveDataByMatchId(matchId: string): Promise<GameModel> {
  const existingMatch = await saveMatchForGameAlreadyInDb(matchId);

  if (existingMatch) {
    return existingMatch;
  }

  const gameData = await GetGameDataByMatchId(matchId);

  let seasonId = null;
  if (gameData.info.tournamentCode) {
    seasonId = (await GetDbCode(gameData.info.tournamentCode))?.seasonId;
  }

  let recentlyBuiltRisenTeams = await hasRecentlyBuiltRisenTeams(seasonId);
  if (seasonId && !recentlyBuiltRisenTeams) {
    await buildRisenTeams(seasonId);
  }

  return await SaveSingleMatchById(matchId, gameData, seasonId);
}

export async function SaveSingleMatchById(matchId: string, gameData: RiotMatchDto, seasonId: number): Promise<GameModel> {
  const timelineData = await GetRiotTimelineByMatchId(matchId);

  const timelineStats = ProcessTimeline(timelineData);
  const teamSumStats = SumTeamInfo(gameData.info.participants);

  // We save this to DB in here first, because we need the gameId to save the playerGame data
  const gameObj = await CreateDbGame(gameData, seasonId, CreatePlayerSummary(gameData));

  // Now creat the players
  await CreateDbPlayersWithParticipantData(gameData.info.participants);

  const objsToSave: BaseEntity[] = [];

  for (let i = 0; i < gameData.info.participants.length; i++) {
    const participant = gameData.info.participants[i];
    const teamStats = participant.teamId === 100 ? teamSumStats.blueStats : teamSumStats.redStats;
    const risenTeamId  = await getDbPlayerTeamPlayerPuuid(participant.puuid, seasonId);
    objsToSave.push(CreateDbPlayerGameNoSave(participant, gameObj, timelineStats[i], teamStats, seasonId, i, risenTeamId));
  }
  await SaveObjects(objsToSave);
  return gameObj;
}

// Something has gone wrong with saving the game. The game itself has been saved, but the player games aren't.
// Do this to fix it. 
export async function UpdatePlayersInSingleMatchById(gameObj: GameModel, gameData: RiotMatchDto, foundPlayers: Set<string>): Promise<GameModel> {
  let seasonId = null;

  if (gameData.info.tournamentCode) {
    seasonId = (await GetDbCode(gameData.info.tournamentCode))?.seasonId;
  }

  const timelineData = await GetRiotTimelineByMatchId(ToMatchId(gameObj.gameId));

  const timelineStats = ProcessTimeline(timelineData);
  const teamSumStats = SumTeamInfo(gameData.info.participants);

  // Now create the players
  await CreateDbPlayersWithParticipantData(gameData.info.participants);

  const objsToSave: PlayerGameModel[] = [];

  for (let i = 0; i < gameData.info.participants.length; i++) {
    const participant = gameData.info.participants[i];
    if (foundPlayers.has(participant.puuid)) {
      continue;
    }

    const risenTeamId  = await getDbPlayerTeamPlayerPuuid(participant.puuid, seasonId);

    const teamStats = participant.teamId === 100 ? teamSumStats.blueStats : teamSumStats.redStats;
    objsToSave.push(CreateDbPlayerGameNoSave(participant, gameObj, timelineStats[i], teamStats, seasonId, i, risenTeamId));
  }
  await SaveObjects(objsToSave);
  return gameObj;
}

function CreatePlayerSummary(gameData: RiotMatchDto): GameSummaryPlayers {
  const redPlayers: GameSummaryPlayer[] = [];
  const bluePlayers: GameSummaryPlayer[] = [];
  for (const participant of gameData.info.participants) {
    const player = {
      championId: participant.championId,
      team: participant.teamId,
      playerName: participant.summonerName,
      tagline: participant.riotIdTagline,
      playerPuuid: participant.puuid,
      summoner1Id: participant.summoner1Id,
      summoner2Id: participant.summoner2Id,
      totalDamage: TotalDamageToChamps(participant),
      totalGold: participant.goldEarned,
      totalCS: participant.totalMinionsKilled + participant.neutralMinionsKilled,
      totalVision: participant.visionScore,
      position: participant.role === 'SUPPORT' ? participant.role : participant.lane,
      kills: participant.kills,
      deaths: participant.deaths,
      assists: participant.assists,
    } as GameSummaryPlayer;
    if (participant.teamId === 100) {
      redPlayers.push(player);
    } else {
      bluePlayers.push(player);
    }
  }
  return {
    redPlayers,
    bluePlayers
  };
}

function SumTeamInfo(participantData: RiotParticipantDto[]): TeamSumStats {
  const blueStats = {
    totalGold: 0,
    totalCS: 0,
    totalVision: 0,
    totalDamage: 0
  } as TeamSumStat;
  const redStats = {
    totalGold: 0,
    totalCS: 0,
    totalVision: 0,
    totalDamage: 0
  } as TeamSumStat;

  for (let i = 0; i < 5; i++) {
    const participant = participantData[i];
    blueStats.totalCS += participant.totalMinionsKilled + participant.neutralMinionsKilled;
    blueStats.totalDamage += TotalDamageToChamps(participant);
    blueStats.totalGold += participant.goldEarned;
    blueStats.totalVision += participant.visionScore;
  }

  for (let i = 5; i < 10; i++) {
    const participant = participantData[i];
    redStats.totalCS += participant.totalMinionsKilled + participant.neutralMinionsKilled;
    redStats.totalDamage += TotalDamageToChamps(participant);
    redStats.totalGold += participant.goldEarned;
    redStats.totalVision += participant.visionScore;
  }

  return {
    blueStats,
    redStats
  } as TeamSumStats;
}

export async function updatePlayerStatsForGame(matchId: string) {
  logger.info(`Updating Player Stats For Match: ${matchId}`);
  const allPlayersGames: PlayerGameModel[] = await GetDbPlayerGamesByGameId(ToGameId(matchId));

  for (let playerGame of allPlayersGames) {
    const fullGame: GameModel = await GetDbGameByGameId(playerGame.gameGameId, true);
    const teamId: number = await getDbPlayerTeamPlayerPuuid(playerGame.playerPuuid, playerGame.seasonId);
    for (let number of getSeasonsToUpdate(playerGame)) {
      await updateStatsFor(playerGame, fullGame, playerGame.playerPuuid, number, playerGame.lobbyPosition as GameRoles, teamId);
    }
  }
}

async function saveMatchForGameAlreadyInDb(matchId: string) {
  const existingObj = await GetDbGameByGameId(ToGameId(matchId));

  if (!existingObj) {
    return null;
  }

  // If its a game for a risen season then update the teams.
  let recentlyBuiltRisenTeams = await hasRecentlyBuiltRisenTeams(existingObj.seasonId);
  if (existingObj.seasonId && !recentlyBuiltRisenTeams) {
    await buildRisenTeams(existingObj.seasonId);
  }

  const playerGames = await GetDbPlayerGamesByGameId(ToGameId(matchId));

  if (playerGames.length !== 10) {
    const foundPlayers = new Set<string>();
    playerGames.map(pg => foundPlayers.add(pg.playerPuuid));
    await UpdatePlayersInSingleMatchById(existingObj, await GetGameDataByMatchId(matchId), foundPlayers);
  }

  return existingObj;
}

export async function hasRecentlyBuiltRisenTeams(seasonId: number): Promise<boolean> {
  let season = await GetDbActiveSeasonWithSheets(seasonId);
  if (!season) {
    return true;
  }
  else if (!season.lastTimeRisenTeamsBuilt) {
    return false;
  }

  let lastUpdateTime = await season.lastTimeRisenTeamsBuilt;
  const timeDifference = Math.abs(new Date().getTime() - lastUpdateTime.getTime());

  // 45 minutes is close to p90 of game times, should be enough to avoid some costly team rebuilds.
  const fourtyMinutesInMilliseconds = 45 * 60 * 1000;

  return timeDifference <= fourtyMinutesInMilliseconds;
}