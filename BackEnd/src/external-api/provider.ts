import { InvalidRequestError } from "../../../Common/errors";
import { MakeRiotAPICall, MakeTournamentRiotAPICall } from "./_call";

export async function CreateRiotTournamentProvider(callbackUrl: string, region="NA"): Promise<number>
{
  if (callbackUrl.length < 3 || !region)
  {
    throw new InvalidRequestError("Requires callbackUrl and region");
  }
  return await MakeTournamentRiotAPICall<number>("/lol/tournament-stub/v4/providers", "POST", {
    "region": region,
    "url": callbackUrl
  });
}