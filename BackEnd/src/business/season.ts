import { CreateDbSeasonWithProviderId, GetDbSeasons } from '../db/season';
import SeasonModel from '../../../Common/models/season.model';
import { CreateRiotTournament } from '../external-api/tournament';

export async function CreateSeason(seasonName: string, providerId: number): Promise<SeasonModel> {
  const tournamentId = await CreateRiotTournament(seasonName, providerId);
  return await CreateDbSeasonWithProviderId(seasonName, tournamentId, providerId);
}

export async function GetSeasons(active: boolean): Promise<SeasonModel[]> {
  return await GetDbSeasons(active);
}
