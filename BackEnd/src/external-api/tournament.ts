import { InvalidRequestError } from "../../../Common/errors";
import { MakeRiotAPICall, MakeTournamentRiotAPICall } from "./_call";

export async function CreateRiotTournament(name: string, providerId: number): Promise<number>
{
  if (name.length < 3 || providerId <= 0)
  {
    throw new InvalidRequestError("Name must be longer than 3 characters and providerId must be greater than 0");
  }
  return await MakeTournamentRiotAPICall<number>("/lol/tournament-stub/v4/tournaments", "POST", {
    "name": name,
    "providerId": providerId
  });
}