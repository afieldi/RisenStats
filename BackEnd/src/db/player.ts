import { DocumentNotFound } from "../../../Common/errors";
import { RiotLeagueEntryDto, RiotSummonerDto } from "../../../Common/Interface/RiotAPI/RiotApiDto";
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