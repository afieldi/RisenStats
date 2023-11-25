import { InvalidRequestError } from '../../../Common/errors';
import { MakeTournamentRiotAPICall } from './_call';

export async function CreateRiotTournamentCodes(tournamentId: number, count: number): Promise<string[]> {
  if (tournamentId < 0 || count < 1) {
    throw new InvalidRequestError(`Invalid tournamentId(${tournamentId}) or count(${count})`);
  }
  return await MakeTournamentRiotAPICall<string[]>(`/lol/tournament/v5/codes?count=${count}&tournamentId=${tournamentId}`, 'POST', {
    mapType: 'SUMMONERS_RIFT',
    metadata: `${tournamentId}`,
    pickType: 'TOURNAMENT_DRAFT',
    spectatorType: 'ALL',
    teamSize: 5
  });
}
