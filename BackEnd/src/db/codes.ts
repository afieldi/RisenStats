import { ensureConnection, SaveObjects } from "./dbConnect";
import CodeModel from "../../../Common/models/code.model";

export async function GetDbCodes(seasonId: number | null): Promise<CodeModel[]>
{
  await ensureConnection();
  if (seasonId)
  {
    return await CodeModel.findBy({ seasonId: seasonId });
  }
  return await CodeModel.find();
}

export async function CreateDbCodes(codes: string[], seasonId: number): Promise<CodeModel[]>
{
  let codeModels = []
  for (let code of codes)
  {
    codeModels.push(
      CodeModel.create({
        code: code,
        seasonId: seasonId
      })
    );
  }
  await SaveObjects(codeModels);
  return codeModels;
}

export async function GetDbCode(code: string): Promise<CodeModel>
{
  await ensureConnection();
  return await CodeModel.findOne({where: {code: code}});
}