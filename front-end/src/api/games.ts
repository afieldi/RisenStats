import { MakeBackendCall } from './_call';
import { GetGamesBySeasonIdResponse } from '../../../Common/Interface/Internal/games';

export async function getGamesBySeasonId(seasonId: number) {
  return await MakeBackendCall(`/api/games/by-seasonId/${seasonId}`, 'POST', {}) as GetGamesBySeasonIdResponse;
}