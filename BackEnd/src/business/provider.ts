import { CreateDbTournamentProvider, GetDbTournamentProviders } from '../db/provider'
import ProviderModel from '../../../Common/models/provider.model'
import { CreateRiotTournamentProvider } from '../external-api/provider'

export async function CreateTournamentProvider(callback: string, region: string): Promise<ProviderModel> {
  const providerId = await CreateRiotTournamentProvider(callback, region)
  return await CreateDbTournamentProvider(callback, providerId)
}

export async function GetTournamentProviders(): Promise<ProviderModel[]> {
  return await GetDbTournamentProviders()
}
