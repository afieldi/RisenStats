import {
  CreateDbSeasonWithProviderId,
  GetDbActiveSeasonsBySeasonIds,
  GetDbSeasonById,
  GetDbSeasonByName,
  GetDbSeasons,
  UpdateDbSeasonGoogleSheetId
} from '../db/season';
import SeasonModel from '../../../Common/models/season.model';
import { CreateRiotTournament } from '../external-api/tournament';
import { GetPlayerSeasons } from './player';
import { InvalidRequestError } from '../../../Common/errors';

export async function CreateSeason(seasonName: string, providerId: number): Promise<SeasonModel> {
  const tournamentId = await CreateRiotTournament(seasonName, providerId);
  return await CreateDbSeasonWithProviderId(seasonName, tournamentId, providerId);
}

export async function UpdateSeasonGoogleSheetId(seasonId: number, googleSheetId: string): Promise<SeasonModel> {
  const season = await GetDbSeasonById(seasonId);
  if (!season.active) {
    throw new InvalidRequestError('Cannot update googleSheetId of an inactive season');
  }
  return await UpdateDbSeasonGoogleSheetId(seasonId, googleSheetId);
}

export async function GetSeasons(active: boolean): Promise<SeasonModel[]> {
  return await GetDbSeasons(active);
}

export async function GetSeasonBySearchName(searchName: string): Promise<SeasonModel> {
  try {
    return await GetDbSeasonByName(searchName);
  } catch (err) {
    return null;
  }
}
export async function GetActiveSeasonThatPlayerHasParticiaptedInByPuuid(playerPuuid: string): Promise<SeasonModel[]> {
  try {
    let seasonIds = await GetPlayerSeasons(playerPuuid);
    return await GetDbActiveSeasonsBySeasonIds(seasonIds);
  } catch (err) {
    return [];
  }
}
