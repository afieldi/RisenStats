import { GetRiotPlayerByName, GetRiotLeagueBySummonerId } from "../external-api/player";
import PlayerModel from "../../../Common/models/player.model";
import { DocumentNotFound } from "../../../Common/errors";
import { CreateDbPlayerWithRiotPlayer, GetDbPlayerByPuuid } from "../db/player";

export async function GetPlayerOverviewByName(playerName: string): Promise<PlayerModel> {
  const riotPlayer = await GetRiotPlayerByName(playerName);
  if (!riotPlayer) {
    throw new DocumentNotFound(`Player with name ${playerName} not found`);
  }

  try {
    return await GetDbPlayerByPuuid(riotPlayer.puuid);
  } catch (error) {}

  const riotLeague = await GetRiotLeagueBySummonerId(riotPlayer.id);
  return await CreateDbPlayerWithRiotPlayer(riotPlayer, riotLeague);
}

export async function GetPlayerOverviewByPuuid(playerPuuid: string): Promise<PlayerModel> {
  // If player doesn't exist in db, escalate issue back to client
  return await GetDbPlayerByPuuid(playerPuuid);
}