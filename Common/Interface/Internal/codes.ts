import CodeModel from "../../models/code.model";

export interface GetCodesResponse {
  codes: CodeModel[];
}

export interface CreateCodesRequest {
  count: number;
  seasonId: number;
}