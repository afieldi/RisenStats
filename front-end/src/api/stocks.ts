import { MakeBackendCall } from './_call';
import { GetStockTimelineResponse } from '../../../Common/Interface/Internal/stocks';

export async function getStockTimelineForSeason(seasonId: number) {
  return await MakeBackendCall(`/api/stocks/get-timeline/${seasonId}`, 'POST', { }) as GetStockTimelineResponse;
}