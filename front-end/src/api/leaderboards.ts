import { GameRoles } from '../../../Common/Interface/General/gameEnums';
import { MakeBackendCall } from './_call';
import { GetLeaderboardRequest, GetLeaderboardResponse } from '../../../Common/Interface/Internal/leaderboard';
import AggregatedPlayerStatModel from '../../../Common/models/aggregatedplayerstat.model';

export async function getFlattenedLeaderboard(seasonId?: number, risenOnly?: boolean, roleId?: string, collapseRoles?: boolean) : Promise<AggregatedPlayerStatModel[]> {
  return (await GetLeaderboards(seasonId, risenOnly,  roleId, collapseRoles)).playerStats;
}

export async function GetLeaderboards(seasonId?: number, risenOnly?: boolean, roleId?: string, collapseRoles?: boolean): Promise<GetLeaderboardResponse> {
  const role = GameRoles[roleId as keyof typeof GameRoles];
  return await MakeBackendCall<GetLeaderboardRequest>('/api/stats/leaderboards/', 'POST', { seasonId, risenOnly, roleId: role, collapseRoles }) as GetLeaderboardResponse;
}
