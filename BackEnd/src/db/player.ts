import { ConnectionManager, getConnection, getConnectionManager } from "typeorm";
import { DocumentNotFound } from "../../../Common/errors";
import { RiotLeagueEntryDto, RiotParticipantDto, RiotSummonerDto } from "../../../Common/Interface/RiotAPI/RiotApiDto";
import PlayerModel from "../../../Common/models/player.model";
import { GetCurrentEpcohMs, toSearchName } from "../../../Common/utils";
import { ensureConnection } from "./dbConnect";

export async function GetDbPlayerByPuuid(playerPuuid: string): Promise<PlayerModel> {
  await ensureConnection();
  const player = await PlayerModel.findOne({ where: { puuid: playerPuuid } });
  if (!player) {
    throw new DocumentNotFound("Player not found");
  }
  return player;
}

export async function CreateDbPlayerWithRiotPlayer(player: RiotSummonerDto, soloQLeague: RiotLeagueEntryDto): Promise<PlayerModel> {
  await ensureConnection();
  const playerDto = PlayerModel.create({
    puuid: player.puuid,
    name: player.name,
    summonerId: player.id,
    profileIconId: player.profileIconId ? player.profileIconId : 0,
    summonerLevel: player.summonerLevel ? player.summonerLevel : 0,
    searchName: toSearchName(player.name),
    league: soloQLeague?.tier ? soloQLeague.tier : "UNRANKED",
    division: soloQLeague?.rank ? soloQLeague.rank : "I",
    refreshedAt: GetCurrentEpcohMs(),
  });
  await playerDto.save();
  return playerDto;
}

export async function CreateDbPlayersWithParticipantData(participants: RiotParticipantDto[]): Promise<PlayerModel[]> {
  await ensureConnection();
  let playerObjs = [];
  for (const participant of participants) {
    playerObjs.push(PlayerModel.create({
      puuid: participant.puuid,
      name: participant.summonerName,
      summonerId: participant.summonerId,
      profileIconId: participant.profileIcon ? participant.profileIcon : 0,
      summonerLevel: participant.summonerLevel ? participant.summonerLevel : 0,
      searchName: toSearchName(participant.summonerName),
      league: "UNRANKED",
      division: "I",
      refreshedAt: 0,
    }));
  }
  await getConnection().manager.save(playerObjs);
  return playerObjs;
}