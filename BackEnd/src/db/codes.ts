import { ensureConnection, SaveObjects } from './dbConnect'
import CodeModel from '../../../Common/models/code.model'

export async function GetDbCodes(seasonId: number | null): Promise<CodeModel[]> {
  await ensureConnection()
  if (seasonId) {
    return await CodeModel.findBy({ seasonId })
  }
  return await CodeModel.find()
}

export async function CreateDbCodes(codes: string[], seasonId: number): Promise<CodeModel[]> {
  const codeModels = []
  for (const code of codes) {
    codeModels.push(
      CodeModel.create({
        code,
        seasonId
      })
    )
  }
  await SaveObjects(codeModels)
  return codeModels
}

export async function GetDbCode(code: string): Promise<CodeModel> {
  await ensureConnection()
  return await CodeModel.findOne({ where: { code } })
}
