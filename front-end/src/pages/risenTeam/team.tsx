import { useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { Container, CssBaseline, Typography } from '@mui/material';
import { Box } from '@mui/system';
import TeamPageHeader from '../../components/team-page/header';
import TeamPageGeneralStats from '../../components/team-page/general';
import SeasonModel from '../../../../Common/models/season.model';
import TeamModel from '../../../../Common/models/team.model';
import PlayerGameModel from '../../../../Common/models/playergame.model';
import { getLeagueTeamByTeamAbbreviation, getLeagueTeamRosterByTeamId, getLeagueTeamsBySeasonId } from '../../api/teams';
import { getPlayerGamesBySeasonId, getRecentGamesBySeasonId, getRecentGamesBySeasonIdAndTeamId } from '../../api/games';
import { getSeasonBySearchName } from '../../api/season';
import Loading from '../../components/loading/loading';
import PlayerTeamModel from '../../../../Common/models/playerteam.model';


function TeamPage() {
  let { leagueName } = useParams();
  let { teamAbbr } = useParams();

  const [loading, setLoading] = useState(true);
  const [season, setSeason] = useState<SeasonModel>();
  const [team, setTeam] = useState<TeamModel>();
  const [teamPlayerGames, setTeamPlayerGames] = useState<PlayerGameModel[]>([]);
  const [teams, setTeams] = useState<Map<number, TeamModel>>(new Map());
  const [leaguePlayerGames, setLeaguePlayerGames] = useState<PlayerGameModel[]>([]);
  const [teamRoster, setTeamRoster] = useState<PlayerTeamModel[]>([]);

  const [loadingTeamRoster, setLoadingTeamRoster] = useState(false);
  const [loadingGames, setLoadingGames] = useState(false);
  const [loadingTeams, setLoadingTeams] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  function isLoadingData() {
    return loadingGames || loadingTeamRoster || loading || loadingTeams;
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

  async function loadTeam(seasonId: number): Promise<TeamModel> {
    if(!teamAbbr) {
      throw new Error('TeamId not found!');
    }

    let response = await getLeagueTeamByTeamAbbreviation(teamAbbr, seasonId);
    if (!response.team) {
      throw Error(`Could not find team ${teamAbbr} in seasonId ${seasonId}`);
    }

    setTeam(response.team);
    return response.team;
  }

  async function loadTeamRoster(teamId: number, seasonId: number) {
    if (teamRoster.length > 0 || loadingTeamRoster) {
      console.log('Not reloading roster');
      return;
    }
    setLoadingTeamRoster(true);
    try {
      let response = await getLeagueTeamRosterByTeamId(teamId, seasonId);
      setTeamRoster(response.roster);
    } catch (err) {
      console.error('An error occured trying to load the team roster');
    }
    setLoadingTeamRoster(false);
  }

  function errorOnLoad(err: Error) {
    setErrorMessage(err.message);
  }

  function hasErrorToDisplay(): boolean {
    return errorMessage != null && errorMessage.length > 0;
  }


  function canDisplayStats(): boolean {
    return season !== undefined && team !== undefined;
  }

  async function loadTeamGames(teamId: number, seasonId: number) {
    if (teamPlayerGames.length > 0 || loadingGames) {
      console.log('Not reloading league games.');
      return;
    }

    setLoadingGames(true);
    try {
      let playerGameResponse = await getRecentGamesBySeasonIdAndTeamId(seasonId, teamId);
      setTeamPlayerGames(playerGameResponse.games);
    }
    catch (error) {
      console.error('An error occured trying to load the team games');
    }
    setLoadingGames(false);
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

  useEffect(() => {
    loadSeason()
      .then(async seasonResponse => {
        const team = await loadTeam(seasonResponse.id);
        await loadTeamGames(team.teamId, seasonResponse.id);
        await loadTeamRoster(team.teamId, seasonResponse.id);
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
          <TeamPageHeader teamName={team?.displayName} teamAbbr={teamAbbr}/>
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
            !hasErrorToDisplay() && !isLoadingData() && canDisplayStats() && <TeamPageGeneralStats
              season={season as SeasonModel}
              teamGames={teamPlayerGames}
              team={team as TeamModel}
              teamRoster={teamRoster}
              leagueGames={leaguePlayerGames}
              leagueTeams={teams}/>
          }
        </Box>
      </main>
    </Container>
  );
}

export default TeamPage;