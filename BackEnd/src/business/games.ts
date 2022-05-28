import { CreateDbGame, CreateDbPlayerGameNoSave, GetDbGameByGameId } from "../db/games";
import { GameSummaryPlayer, GameSummaryPlayers, TeamSumStat, TeamSumStats } from "../../../Common/Interface/Database/game";
import { RiotMatchDto, RiotParticipantDto } from "../../../Common/Interface/RiotAPI/RiotApiDto";
import GameModel from "../../../Common/models/game.model";
import { ToGameId, TotalDamageToChamps } from "../../../Common/utils";
import { GetRiotGameByMatchId, GetRiotTimelineByMatchId } from "../external-api/game";
import { ProcessTimeline } from "./timeline";
import { BaseEntity, getConnection } from "typeorm";
import { CreateDbPlayersWithParticipantData } from "../db/player";

export async function SaveSingleMatchById(matchId: string, seasonId: number = null): Promise<GameModel> {
  const existingObj = await GetDbGameByGameId(ToGameId(matchId));
  if (existingObj) {
    return existingObj;
  }
  const gameData = await GetRiotGameByMatchId(matchId);
  const timelineData = await GetRiotTimelineByMatchId(matchId);

  const timelineStats = ProcessTimeline(timelineData);
  const teamSumStats = SumTeamInfo(gameData.info.participants);

  // We save this to DB in here first, because we need the gameId to save the playerGame data
  const gameObj = await CreateDbGame(gameData, seasonId, CreatePlayerSummary(gameData));

  // Now creat the players
  await CreateDbPlayersWithParticipantData(gameData.info.participants);

  let objsToSave: BaseEntity[] = [];

  for (let i = 0; i < gameData.info.participants.length; i++) {
    const participant = gameData.info.participants[i];
    const teamStats = participant.teamId === 100 ? teamSumStats.blueStats : teamSumStats.redStats;
    objsToSave.push(CreateDbPlayerGameNoSave(participant, gameObj, timelineStats[i], teamStats));
  }

  getConnection().manager.save(objsToSave);
  return gameObj;
}

function CreatePlayerSummary(gameData: RiotMatchDto): GameSummaryPlayers {
  let redPlayers: GameSummaryPlayer[] = [];
  let bluePlayers: GameSummaryPlayer[] = [];
  for (const participant of gameData.info.participants) {
    const player = {
      championId: participant.championId,
      team: participant.teamId,
      playerName: participant.summonerName,
      playerPuuid: participant.summonerId,
      summoner1Id: participant.summoner1Id,
      summoner2Id: participant.summoner2Id,
      totalDamage: TotalDamageToChamps(participant),
      totalGold: participant.goldEarned,
      totalCS: participant.totalMinionsKilled + participant.neutralMinionsKilled,
      totalVision: participant.visionScore,
      position: participant.lane
    } as GameSummaryPlayer;
    if (participant.teamId === 100) {
      redPlayers.push(player);
    } else {
      bluePlayers.push(player);
    }
  }
  return {
    redPlayers: redPlayers,
    bluePlayers: bluePlayers
  };
}

function SumTeamInfo(participantData: RiotParticipantDto[]) : TeamSumStats
{
  let blueStats = {
    totalGold: 0,
    totalCS: 0,
    totalVision: 0,
    totalDamage: 0
  } as TeamSumStat;
  let redStats = {
    totalGold: 0,
    totalCS: 0,
    totalVision: 0,
    totalDamage: 0
  } as TeamSumStat;

  for (let i = 0; i < 5; i++)
  {
    let participant = participantData[i];
    blueStats.totalCS += participant.totalMinionsKilled + participant.neutralMinionsKilled;
    blueStats.totalDamage += TotalDamageToChamps(participant);
    blueStats.totalGold += participant.goldEarned;
    blueStats.totalVision += participant.visionScore;
  }

  for (let i = 5; i < 10; i++)
  {
    let participant = participantData[i];
    redStats.totalCS += participant.totalMinionsKilled + participant.neutralMinionsKilled;
    redStats.totalDamage += TotalDamageToChamps(participant);
    redStats.totalGold += participant.goldEarned;
    redStats.totalVision += participant.visionScore;
  }

  return {
    blueStats: blueStats,
    redStats: redStats
  } as TeamSumStats;
}