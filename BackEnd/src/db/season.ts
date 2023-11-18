import SeasonModel from '../../../Common/models/season.model';
import { DocumentNotFound } from '../../../Common/errors';
import { ensureConnection } from './dbConnect';
import { toSearchName } from '../../../Common/utils';
import { GetDbTournamentProvider } from './provider';
import ProviderModel from '../../../Common/models/provider.model';
import { IsNull, Not } from 'typeorm';

export async function GetDbSeasons(active: boolean): Promise<SeasonModel[]> {
  await ensureConnection();
  const filter = active ? { where: { active: true } } : {};
  return await SeasonModel.find(filter);
}

export async function CreateDbSeasonWithProvider(name: string, tourneyId: number, provider: ProviderModel): Promise<SeasonModel> {
  await ensureConnection();
  const obj = await SeasonModel.create({
    seasonName: name,
    searchname: toSearchName(name),
    active: true,
    provider,
    tourneyId
  });

  return await obj.save();
}

export async function CreateDbSeasonWithProviderId(name: string, tourneyId: number, providerId: number): Promise<SeasonModel> {
  return await CreateDbSeasonWithProvider(name, tourneyId, await GetDbTournamentProvider(providerId));
}

export async function GetDbSeasonByName(name: string): Promise<SeasonModel> {
  await ensureConnection();
  const obj = await SeasonModel.findOne({ where: { searchname: toSearchName(name) } });
  if (!obj) {
    throw new DocumentNotFound(`Season with name ${name} not found`);
  }
  return obj;
}

export async function GetDbSeasonById(id: number): Promise<SeasonModel> {
  await ensureConnection();
  const obj = await SeasonModel.findOneBy({ id });
  if (!obj) {
    throw new DocumentNotFound(`Season with id ${id} not found`);
  }
  return obj;
}

export async function GetDbActiveSeasonsWithSheets(): Promise<SeasonModel[]> {
  await ensureConnection();
  return await SeasonModel.find({ where: { active: true, googleSheetId: Not(IsNull()), googleSheetParserType: Not(IsNull()) } });
}

export async function GetDbActiveSeasonWithSheets(seasonId: number): Promise<SeasonModel> {
  await ensureConnection();
  return await SeasonModel.findOne({ where: { active: true, id: seasonId, googleSheetId: Not(IsNull()), googleSheetParserType: Not(IsNull()) } });
}

export async function SetDBLastTimeActiveSeasonRisenTeamWasBuilt(time: Date, season: SeasonModel): Promise<SeasonModel> {
  await ensureConnection();
  season.lastTimeRisenTeamsBuilt = time;
  return season.save();
}
