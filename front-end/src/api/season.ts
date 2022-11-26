import {GetSeasonsResponse} from "../../../Common/Interface/Internal/season";
import {MakeBackendCall} from "./_call";

export async function GetActiveSeasons(): Promise<GetSeasonsResponse> {
    return await MakeBackendCall("/api/season/get/active", "POST", {}) as GetSeasonsResponse;
}