import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Theme,
  Typography,
  useTheme
} from '@mui/material';
import React, { useState } from 'react';
import { BarChart, Bar, Rectangle, XAxis, YAxis, Legend, ResponsiveContainer, Tooltip } from 'recharts';
import TeamModel from '../../../../Common/models/team.model';
import PlayerGameModel from '../../../../Common/models/playergame.model';
import {
  getDisplayValueForTeamLeaderboardForAverage,
  getRisenTeamGameCountForLeague,
  getRisenTeamTotalStatForLeague,
} from '../../common/stats-generators/team/RisenTeamStatGenerator';
import BaseRisenBox from '../risen-box/base-risen-box';
import { getGradient } from '../league-page/general';
import Loading from '../loading/loading';

interface StatsVsRestOfLeagueProps {
  primaryTeam: TeamModel,
  leagueTeams: Map<number, TeamModel>;
  leagueGames: PlayerGameModel[]
}

interface ChartOptions {
  statLabel: string,
  entries: Map<number, number>
}

interface StatSelectorProps {
  current: string,
  ids: string[]
  callback: (event: SelectChangeEvent) => any
}

interface TeamSelectorProps {
  current: TeamModel
  teams: TeamModel[]
  callback: (event: SelectChangeEvent) => any
}

export default function StatsVsRestOfLeague(props: StatsVsRestOfLeagueProps) {
  const theme = useTheme() as Theme;

  if(!props.primaryTeam || props.leagueTeams.size < 1 || props.leagueTeams.size < 1) {
    return (
      <Loading/>
    );
  }

  let first = props.leagueTeams.values().next().value;

  const gameCounts = getRisenTeamGameCountForLeague(props.leagueGames);
  const [allStats, setAllStats] = useState<Map<string, Map<number, number>>>(buildStatsToCompare(props.leagueGames, gameCounts));
  const [currentTeamToCompareTo, setCurrentTeamToCompareTo] = useState<TeamModel>(first);
  const [currentStat , setCurrentStat] = useState<string>('GD15');

  let compare = (allStats.get(currentStat) as Map<number, number>).get(currentTeamToCompareTo.teamId) as number;
  let main = (allStats.get(currentStat)as Map<number, number>).get(props.primaryTeam.teamId) as number;

  const data = [
    {
      name: currentTeamToCompareTo.abbreviation,
      [currentTeamToCompareTo.abbreviation]: getDisplayValueForTeamLeaderboardForAverage(compare, currentTeamToCompareTo.teamId, gameCounts),
      [props.primaryTeam.abbreviation]: getDisplayValueForTeamLeaderboardForAverage(main, props.primaryTeam.teamId, gameCounts)
    }
  ];

  function onSelectChange(event: SelectChangeEvent) {
    setCurrentStat(event.target.value);
  }

  function onTeamSelectChange(event: SelectChangeEvent) {
    let teamId = Number(event.target.value);
    setCurrentTeamToCompareTo(props.leagueTeams.get(teamId) as TeamModel);
  }

  let title = (
    <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
      <Typography sx={{ pt: 1 }} fontFamily="Montserrat" variant='h5' align='left' color={theme.palette.info.main}>COMPARE STATS</Typography>
      <Box sx={{ display: 'flex', flexDirection: 'row', columnGap: 1 }}>
        <StatSelector current={currentStat} callback={onSelectChange} ids={Array.from(allStats.keys())}></StatSelector>
        <TeamSelector current={currentTeamToCompareTo} teams={Array.from(props.leagueTeams.values())} callback={onTeamSelectChange}/>
      </Box>
    </Box>
  );

  return (
    <BaseRisenBox sx={{ minWidth: 280, minHeight: 280, flexGrow: 1,  background: getGradient(theme.palette.risenBoxBg.main) }} title={title} hideDivider={true}>
      <BarChart
        width={500}
        height={300}
        data={data}
        margin={{
          top: 10,
          right: 0,
          left: -15,
          bottom: 5,
        }}
      >
        <YAxis />
        <Legend />
        <Tooltip></Tooltip>
        <Bar barSize={200} dataKey={props.primaryTeam.abbreviation} fill={theme.palette.primary.main}/>
        <Bar barSize={200} dataKey={currentTeamToCompareTo.abbreviation} fill={theme.palette.secondary.light}/>
      </BarChart>
    </BaseRisenBox>
  );
}

function buildStatsToCompare(games: PlayerGameModel[], gameCounts: Map<number, number>): Map<string, Map<number, number>> {
  let statsToCompare: Map<string, Map<number, number>> = new Map();
  statsToCompare.set('GD15',  getRisenTeamTotalStatForLeague(games, ['goldDiff15']));
  statsToCompare.set('CSD15',  getRisenTeamTotalStatForLeague(games, ['csDiff15']));
  statsToCompare.set('Barons',  getRisenTeamTotalStatForLeague(games, ['baronKills']));
  statsToCompare.set('Heralds',  getRisenTeamTotalStatForLeague(games, ['riftHeraldKills']));
  statsToCompare.set('Grubs',  getRisenTeamTotalStatForLeague(games, ['voidgrubKills']));
  statsToCompare.set('Crabs',  getRisenTeamTotalStatForLeague(games, ['scuttleCrabKills']));
  statsToCompare.set('Plates',  getRisenTeamTotalStatForLeague(games, ['turretPlatesTaken']));
  statsToCompare.set('Dragons',  getRisenTeamTotalStatForLeague(games, ['oceanDragonKills', 'mountainDragonKills', 'chemtechDragonKills', 'elderDragonKills', 'infernalDragonKills', 'hextechDragonKills', 'cloudDragonKills']));

  return statsToCompare;
}

function StatSelector(props: StatSelectorProps) {
  return (
    <FormControl >
      <InputLabel id="season-filter-select-label">Stat</InputLabel>
      <Select
        labelId="stat-filter-select-label"
        id="stat-simple-select"
        value={props.current}
        label="Season"
        onChange={props.callback}
        sx={{ overflow: 'hidden', width: '100%' }}
      >
        {
          props.ids.map((id, index) => (
            <MenuItem key={index} value={id} hidden={false}>{id}</MenuItem>
          ))
        }
      </Select>
    </FormControl>
  );
}

function TeamSelector(props: TeamSelectorProps) {
  return (
    <FormControl >
      <InputLabel id="season-filter-select-label">Team</InputLabel>
      <Select
        labelId="team-filter-select-label"
        id="team-simple-select"
        value={props.current.teamId.toString()}
        label="Team"
        onChange={props.callback}
        sx={{ overflow: 'hidden', width: '100%' }}
      >
        {
          props.teams.map((team, index) => (
            <MenuItem key={index} value={team.teamId} hidden={false}>{team.abbreviation}</MenuItem>
          ))
        }
      </Select>
    </FormControl>
  );
}