import { GetCodesResponse } from '../../../Common/Interface/Internal/codes';
import { MakeBackendCall } from './_call';

export async function GenerateCodes(count: number, seasonId: string) {
  return await MakeBackendCall('/api/codes/create', 'POST', { count, seasonId }) as GetCodesResponse;
}