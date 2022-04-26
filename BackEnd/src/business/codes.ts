import { ensureConnection } from "../db/dbConnect";
import CodeModel from "../../../models/code.model";

export async function getAllCodes(): Promise<CodeModel[]>
{
  await ensureConnection();
  return await CodeModel.find();
}
