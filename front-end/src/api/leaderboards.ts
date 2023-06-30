import { GameRoles } from '../../../Common/Interface/General/gameEnums';
import { MakeBackendCall } from './_call';
import { GetLeaderboardRequest, GetLeaderboardResponse } from '../../../Common/Interface/Internal/leaderboard';
import AggregatedPlayerStatModel from '../../../Common/models/aggregatedplayerstat.model';

export async function getFlattenedLeaderboard(seasonId: number, roleId?: GameRoles) : Promise<AggregatedPlayerStatModel[]> {
  return (await GetLeaderboards(seasonId, roleId)).playerStats;
}

export async function GetLeaderboards(seasonId: number, roleId?: GameRoles): Promise<GetLeaderboardResponse> {
  if (!roleId) {
    roleId = GameRoles.ALL;
  }
  const role = GameRoles[roleId as keyof typeof GameRoles];
  return await MakeBackendCall<GetLeaderboardRequest>('/api/stats/leaderboards/', 'POST', { seasonId, roleId: role }) as GetLeaderboardResponse;
}
