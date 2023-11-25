import { Container, CssBaseline, Typography } from '@mui/material';
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
import { getRecentGamesBySeasonId, getPlayerGamesBySeasonId } from '../../api/games';
import GameModel from '../../../../Common/models/game.model';
import Loading from '../../components/loading/loading';

const amountOfGamesToShow = 5;

function LeaguePage() {
  let { leagueName } = useParams();

  const [loading, setLoading] = useState(true);
  const [season, setSeason] = useState<SeasonModel>();
  const [teams, setTeams] = useState<Map<number, TeamModel>>(new Map());
  const [leaguePlayerGames, setLeaguePlayerGames] = useState<PlayerGameModel[]>([]);
  const [recentLeagueMatches, setRecentLeagueMatches] = useState<GameModel[]>([]);

  const [loadingGames, setLoadingGames] = useState(false);
  const [loadingTeams, setLoadingTeams] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  function isLoadingData() {
    return loadingTeams || loadingTeams || loading;
  }

  async function loadSeason(): Promise<SeasonModel> {
    if (!leagueName) {
      throw new Error('League name is undefined!');
    }

    const response = await getSeasonBySearchName(leagueName as string);
    if (!response.season) {
      throw Error('Season Not Found');
    }
    setSeason(response.season);
    return response.season;
  }

  async function loadLeagueGames(seasonId: number) {
    if (leaguePlayerGames.length > 0 || loadingGames) {
      console.log('Not reloading league games.');
      return;
    }

    setLoadingGames(true);
    try {
      let playerGameResponse = await getPlayerGamesBySeasonId(seasonId);
      setLeaguePlayerGames(playerGameResponse.games);

      let recentGamesResponse = await getRecentGamesBySeasonId(seasonId, amountOfGamesToShow);
      setRecentLeagueMatches(recentGamesResponse.games);
    }
    catch (error) {
      console.error('An error occured trying to load the league games');
    }
    setLoadingGames(false);
  }

  async function loadTeamsForLeague(seasonId: number) {
    if (teams.size > 0 || loadingTeams) {
      console.log('Not reloading league teams.');
      return;
    }

    setLoadingTeams(true);
    let response = await getLeagueTeamsBySeasonId(seasonId);
    if (response.teams.length < 1) {
      throw Error('No teams found!');
    }

    let teamsMap: Map<number, TeamModel> = new Map();
    for (let team of response.teams) {
      teamsMap.set(team.teamId, team);
    }

    setTeams(teamsMap);

    setLoadingTeams(false);
  }

  function canDisplayStats(): boolean {
    return season !== undefined;
  }

  function errorOnLoad(err: Error) {
    setErrorMessage(err.message);
  }

  function hasErrorToDisplay(): boolean {
    return errorMessage != null && errorMessage.length > 0;
  }

  useEffect(() => {
    loadSeason()
      .then(async seasonResponse => {
        await loadLeagueGames(seasonResponse.id);
        await loadTeamsForLeague(seasonResponse.id);
        setLoading(false);
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
          {
            hasErrorToDisplay() &&
              <Box sx={{ pt: 5, display: 'flex', justifyContent: 'space-evenly' }}>
                <Typography fontFamily="Montserrat" variant='h4' align='left'>{errorMessage}</Typography>
              </Box>
          }
          {
            isLoadingData() && <Loading />
          }
          {
            !hasErrorToDisplay() && !isLoadingData() && canDisplayStats() && <LeaguePageGeneralStats season={season as SeasonModel}
              teams={teams}
              recentGames={recentLeagueMatches}
              playerGames={leaguePlayerGames}/>
          }
        </Box>
      </main>
    </Container>
  );
}

export default LeaguePage;