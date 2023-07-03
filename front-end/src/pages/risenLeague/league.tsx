import { Container, CssBaseline } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box } from '@mui/system';
import LeaguePageHeader from '../../components/league-page/header';
import LeaguePageGeneralStats from '../../components/league-page/general';
import TeamModel from '../../../../Common/models/team.model';
import PlayerGameModel from '../../../../Common/models/playergame.model';
import SeasonModel from '../../../../Common/models/season.model';
import { getSeasonBySearchName } from '../../api/season';
import { getLeagueTeamsBySeasonId } from '../../api/teams';
import { getGamesBySeasonId } from '../../api/games';

function LeaguePage() {
  let { leagueName } = useParams();

  const [season, setSeason] = useState<SeasonModel>();
  const [teams, setTeams] = useState<TeamModel[]>([]);
  const [leagueGames, setLeagueGames] = useState<PlayerGameModel[]>([]);

  const [loadingGames, setLoadingGames] = useState(false);
  const [loadingTeams, setLoadingTeams] = useState(false);

  async function loadSeason(): Promise<SeasonModel> {
    if (!leagueName) {
      throw new Error('League name is undefined!');
    }

    const response = await getSeasonBySearchName(leagueName as string);
    setSeason(response.season);
    return response.season;
  }

  async function loadLeagueGames(seasonId: number) {
    if (leagueGames.length > 0 || loadingGames) {
      console.log('Not reloading league games.');
      return;
    }

    setLoadingGames(true);
    try {
      let response = await getGamesBySeasonId(seasonId);
      setLeagueGames(response.games);
    }
    catch (error) {
      console.error('An error occured trying to load the league games');
    }
    setLoadingGames(false);
  }

  async function loadTeamsForLeague(seasonId: number) {
    if (teams.length > 0 || loadingTeams) {
      console.log('Not reloading league teams.');
      return;
    }

    setLoadingTeams(true);
    let response = await getLeagueTeamsBySeasonId(seasonId);
    // TODO some error handling here if no teams returned
    setTeams(response.teams);
    setLoadingTeams(false);
  }

  function errorOnLoad(err: Error) {
    // TODO make this set some flag that displays an error message
  }

  useEffect(() => {
    loadSeason()
      .then(async seasonResponse => {
        await loadLeagueGames(seasonResponse.id);
        await loadTeamsForLeague(seasonResponse.id);
      })
      .catch(err => errorOnLoad(err));
  }, []);
  
  return (
    <Container maxWidth="lg" sx={{ minHeight: '100vh' }}>
      <CssBaseline />
      <main>
        <Box sx={{ pt: 15, pb: 6, }}>
          <LeaguePageHeader name={season?.seasonName as string}/>
          <hr></hr>
          <LeaguePageGeneralStats seasonId={season?.id as number} teams={teams} games={leagueGames}></LeaguePageGeneralStats>
        </Box>
      </main>
    </Container>
  );
}

export default LeaguePage;