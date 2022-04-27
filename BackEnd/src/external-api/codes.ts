import { InvalidRequestError } from "../../../Common/errors";
import { MakeRiotAPICall, MakeTournamentRiotAPICall } from "./_call";

export async function CreateRiotTournamentCodes(seasonId: number, count: number): Promise<string[]>
{
  if (seasonId < 0 || count < 1)
  {
    throw new InvalidRequestError(`Invalid seasonId(${seasonId}) or count(${count})`);
  }
  return await MakeTournamentRiotAPICall<string[]>(`/lol/tournament-stub/v4/codes?count=${count}&tournamentId=${seasonId}`, "POST", {
    "mapType": "SUMMONERS_RIFT",
    "metadata": `${seasonId}`,
    "pickType": "TOURNAMENT_DRAFT",
    "spectatorType": "ALL",
    "teamSize": 5
  });
}