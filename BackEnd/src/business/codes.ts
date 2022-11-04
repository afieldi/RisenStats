import { CreateDbCodes, GetDbCodes } from '../db/codes'
import CodeModel from '../../../Common/models/code.model'
import { CreateRiotTournamentCodes } from '../external-api/codes'
import { GetDbSeasonById } from '../db/season'

export async function GetAllCodes(): Promise<CodeModel[]> {
  return await GetDbCodes(null)
}

export async function GetCodesBySeasonId(seasonId: number): Promise<CodeModel[]> {
  return await GetDbCodes(seasonId)
}

export async function CreateCodes(seasonId: number, count: number): Promise<CodeModel[]> {
  const season = await GetDbSeasonById(seasonId)
  const codes = await CreateRiotTournamentCodes(season.tourneyId, count)
  return await CreateDbCodes(codes, seasonId)
}
