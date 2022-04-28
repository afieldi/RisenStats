import { ensureConnection } from "./dbConnect";
import CodeModel from "../../../Common/models/code.model";
import { getConnection } from "typeorm";

export async function GetAllDbCodes(): Promise<CodeModel[]>
{
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
  await ensureConnection();
  await getConnection().manager.save(codeModels);
  return codeModels;
}