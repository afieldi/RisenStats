import SeasonModel from '../../../Common/models/season.model';
import { DocumentNotFound } from '../../../Common/errors';
import { ensureConnection } from './dbConnect';
import { toSearchName } from '../../../Common/utils';
import { GetDbTournamentProvider } from './provider';
import ProviderModel from '../../../Common/models/provider.model';

export async function GetDbSeasons(active: boolean): Promise<SeasonModel[]>
{
  await ensureConnection();
  let filter = active ? {where: {active: true}} : {};
  return await SeasonModel.find(filter);
}

export async function CreateDbSeasonWithProvider(name: string, tourneyId: number, provider: ProviderModel): Promise<SeasonModel>
{
  await ensureConnection();
  const obj = await SeasonModel.create({
    seasonName: name,
    searchname: toSearchName(name),
    active: true,
    provider: provider,
    tourneyId: tourneyId
  });

  return await obj.save();
}

export async function CreateDbSeasonWithProviderId(name: string, tourneyId: number, providerId: number): Promise<SeasonModel>
{
  return await CreateDbSeasonWithProvider(name, tourneyId, await GetDbTournamentProvider(providerId));
}

export async function GetDbSeasonByName(name: string): Promise<SeasonModel>
{
  await ensureConnection();
  const obj = await SeasonModel.findOne({where: {searchname: toSearchName(name)}});
  if (!obj) {
    throw new DocumentNotFound(`Season with name ${name} not found`);
  }
  return obj;
}

export async function GetDbSeasonById(id: number): Promise<SeasonModel>
{
  await ensureConnection();
  const obj = await SeasonModel.findOneBy({id: id});
  if (!obj) {
    throw new DocumentNotFound(`Season with id ${id} not found`);
  }
  return obj;
}
