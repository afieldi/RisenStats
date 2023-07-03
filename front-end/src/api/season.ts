import { GetSeasonRequest, GetSeasonsResponse } from '../../../Common/Interface/Internal/season';
import { MakeBackendCall } from './_call';

export async function GetActiveSeasons(): Promise<GetSeasonsResponse> {
  return await MakeBackendCall('/api/season/get/active', 'POST', {}) as GetSeasonsResponse;
}

export async function GetAllSeasons(): Promise<GetSeasonsResponse> {
  return await MakeBackendCall('/api/season/get/all', 'POST', {}) as GetSeasonsResponse;
}

export async function getSeasonBySearchName(searchName: string) {
  const params: GetSeasonRequest = {
    searchName: searchName
  };

  return await MakeBackendCall('/api/season/get', 'POST', params) as GetSeasonsResponse;
}