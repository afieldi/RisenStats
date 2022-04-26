import { Response } from "express";
import CodeModel from "../../../models/code.model";

export interface GetCodesResponse {
  codes: CodeModel[];
}

