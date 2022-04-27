import { ensureConnection } from "../db/dbConnect";
import ProviderModel from "../../../Common/models/provider.model";
import { DocumentNotFound } from "../../../Common/errors";

export async function GetDbTournamentProviders(): Promise<ProviderModel[]>
{
  await ensureConnection();
  return await ProviderModel.find();
}

export async function CreateDbTournamentProvider(callback: string, providerId: number): Promise<ProviderModel>
{
  await ensureConnection();

  const obj = await ProviderModel.create({
    providerId: providerId,
    callback: callback
  });

  return await obj.save();
}

export async function GetDbTournamentProvider(providerId: number): Promise<ProviderModel>
{
  await ensureConnection();
  const obj = await ProviderModel.findOneBy({ providerId: providerId });
  if (!obj) {
    throw new DocumentNotFound(`Provider with id ${providerId} not found`);
  }
  return obj;
}