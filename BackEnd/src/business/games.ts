import { CreateDbGame, CreateDbPlayerGameNoSave, GetDbGameByGameId, GetDbPlayerGamesByGameId } from '../db/games';
import { GameSummaryPlayer, GameSummaryPlayers, TeamSumStat, TeamSumStats } from '../../../Common/Interface/Database/game';
import { RiotMatchDto, RiotParticipantDto } from '../../../Common/Interface/RiotAPI/RiotApiDto';
import GameModel from '../../../Common/models/game.model';
import { ToGameId, TotalDamageToChamps } from '../../../Common/utils';
import { GetRiotGameByMatchId, GetRiotTimelineByMatchId } from '../external-api/game';
import { ProcessTimeline } from './timeline';
import { BaseEntity } from 'typeorm';
import { CreateDbPlayersWithParticipantData } from '../db/player';
import { SaveObjects } from '../db/dbConnect';
import { GetDbCode } from '../db/codes';
import { GetDbPlayerStatsByPlayerPuuid } from '../db/playerstats';
import { GameRoles } from '../../../Common/Interface/General/gameEnums';
import PlayerStatModel from '../../../Common/models/playerstat.model';
import { aggregateStatsForRow, createInitialPlayerStatModel, getSeasonsToUpdate } from './playerstats';
import PlayerGameModel from '../../../Common/models/playergame.model';
import logger from '../../logger';

export async function SaveDataByMatchId(matchId: string, updatePlayerStats: boolean = false): Promise<GameModel> {
  const existingObj = await GetDbGameByGameId(ToGameId(matchId));
  if (existingObj) {
    return existingObj;
  }

  const gameData = await GetRiotGameByMatchId(matchId);
  if (gameData.info.participants.length !== 10) {
    throw new Error(`Invalid number of participants: ${gameData.info.participants.length}`);
  }

  const savedGameModel: GameModel = await SaveSingleMatchById(matchId, gameData);

  if (updatePlayerStats) {
    await updatePlayerStatsForGame(matchId);
  }

  return savedGameModel;
}

export async function SaveSingleMatchById(matchId: string, gameData: RiotMatchDto): Promise<GameModel> {
  let seasonId = null;

  if (gameData.info.tournamentCode) {
    seasonId = (await GetDbCode(gameData.info.tournamentCode))?.seasonId;
  }

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
    objsToSave.push(CreateDbPlayerGameNoSave(participant, gameObj, timelineStats[i], teamStats, seasonId, i));
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
      playerPuuid: participant.puuid,
      summoner1Id: participant.summoner1Id,
      summoner2Id: participant.summoner2Id,
      totalDamage: TotalDamageToChamps(participant),
      totalGold: participant.goldEarned,
      totalCS: participant.totalMinionsKilled + participant.neutralMinionsKilled,
      totalVision: participant.visionScore,
      position: participant.role === 'SUPPORT' ? participant.role : participant.lane
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
    for (let number of getSeasonsToUpdate(playerGame)) {
      await updateStatsFor(playerGame, fullGame, playerGame.playerPuuid, number, playerGame.lobbyPosition as GameRoles, false);
    }
  }
}

async function updateStatsFor(playerGame: PlayerGameModel, fullgame: GameModel, playerPuuid: string, seasonId: number, roleId: GameRoles, risenOnly: boolean) {
  let currentDbPlayerStats: PlayerStatModel[] = await GetDbPlayerStatsByPlayerPuuid(playerPuuid, seasonId, roleId, risenOnly);
  let updatedDbPlayerStats: PlayerStatModel[] = [];
  if (currentDbPlayerStats.length === 0) {
    currentDbPlayerStats.push(createInitialPlayerStatModel(playerGame, seasonId));
  }

  for (let currentDbPlayerStat of currentDbPlayerStats) {
    updatedDbPlayerStats.push(aggregateStatsForRow(currentDbPlayerStat, playerGame, fullgame));
  }

  await SaveObjects(updatedDbPlayerStats, PlayerStatModel);
}