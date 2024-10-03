import {
  Box, Checkbox,
  FormControl, FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Theme,
  Typography,
  useTheme
} from '@mui/material';
import React, { useState } from 'react';
import { BarChart, Bar, YAxis } from 'recharts';
import TeamModel from '../../../../Common/models/team.model';
import PlayerGameModel from '../../../../Common/models/playergame.model';
import {
  getDisplayValueForTeamLeaderboardForAverage,
  getRisenTeamGameCountForLeague,
  getRisenTeamTotalStatForLeague,
} from '../../common/stats-generators/team/RisenTeamStatGenerator';
import { getGradient } from '../../common/utils';
import BaseRisenBox from '../risen-box/base-risen-box';
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
  allTeams: TeamModel[]
  currentlySelectedTeams: TeamModel[]
  callback: (event: SelectChangeEvent) => any
}

export default function StatsVsRestOfLeague(props: StatsVsRestOfLeagueProps) {
  const theme = useTheme() as Theme;

  if(!props.primaryTeam || props.leagueTeams.size < 1 || props.leagueTeams.size < 1) {
    return (
      <Loading/>
    );
  }

  const gameCounts = getRisenTeamGameCountForLeague(props.leagueGames);
  const [allStats, setAllStats] = useState<Map<string, Map<number, number>>>(buildStatsToCompare(props.leagueGames, gameCounts));
  const [currentTeamsToCompareTo, setCurrentTeamsToCompareTo] = useState<TeamModel[]>(Array.from(props.leagueTeams.values()).filter(team => team.teamId !== props.primaryTeam.teamId));
  const [currentStat , setCurrentStat] = useState<string>('GD15');

  let main = (allStats.get(currentStat)as Map<number, number>).get(props.primaryTeam.teamId) as number;

  const data = {
    name: props.primaryTeam.abbreviation,
    [props.primaryTeam.abbreviation]: getDisplayValueForTeamLeaderboardForAverage(main, props.primaryTeam.teamId, gameCounts)
  };

  currentTeamsToCompareTo.forEach(team => {
    let compare = (allStats.get(currentStat) as Map<number, number>).get(team.teamId) as number;
    data[team.abbreviation] = getDisplayValueForTeamLeaderboardForAverage(compare, team.teamId, gameCounts);
  });

  function onSelectChange(event: SelectChangeEvent) {
    setCurrentStat(event.target.value);
  }

  function onTeamSelectChange(event: SelectChangeEvent) {
    let teamId = Number(event.target.value);
    let teamModel = props.leagueTeams.get(teamId) as TeamModel;
    if(currentTeamsToCompareTo.includes(teamModel)) {
      setCurrentTeamsToCompareTo(prevteams => prevteams.filter(team => team.teamId !== teamId));
    } else {
      setCurrentTeamsToCompareTo(prevTeams => [...prevTeams, teamModel]);
    }
  }

  let title = (
    <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
      <Typography sx={{ pt: 1 }} fontFamily="Montserrat" variant='h5' align='left' color={theme.palette.info.main}>COMPARE STATS</Typography>
      <Box sx={{ display: 'flex', flexDirection: 'row', columnGap: 1 }}>
        <StatSelector current={currentStat} callback={onSelectChange} ids={Array.from(allStats.keys())}></StatSelector>
        <TeamSelector currentlySelectedTeams={currentTeamsToCompareTo} allTeams={Array.from(props.leagueTeams.values()).filter(team => team.teamId !== props.primaryTeam.teamId)} callback={onTeamSelectChange}/>
      </Box>
    </Box>
  );

  return (
    <BaseRisenBox sx={{ maxWidth: 430, minHeight: 280, flexGrow: 1,  background: getGradient(theme.palette.risenBoxBg.main) }} title={title} hideDivider={true}>
      <BarChart
        width={400}
        height={190}
        data={[data]}
        margin={{
          top: 10,
          right: 0,
          left: -15,
          bottom: 10,
        }}
      >
        <YAxis />
        <Bar barSize={100} dataKey={props.primaryTeam.abbreviation} fill={theme.palette.primary.main}/>
        {
          currentTeamsToCompareTo.map((team) => {
            return <Bar barSize={100} dataKey={team.abbreviation} fill={theme.palette.secondary.light}></Bar>;
          })
        }
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
  const theme = useTheme() as Theme;

  return (
    <FormControl sx={{ width: '60px' }}>
      <InputLabel id="team-filter-select-label">Team</InputLabel>
      <Select
        labelId="team-filter-select-label"
        id="team-simple-select"
        value={props.allTeams[0].teamId.toString()}
        label="Team"
        sx={{ overflow: 'hidden', width: '90%' }}
      >
        <Box sx={{ display: 'flex', columnGap: 1, rowGap: 2, flexWrap: 'wrap', maxWidth: '350px', padding: '5px', background: getGradient(theme.palette.risenBoxBg.main) }}>
          {
            props.allTeams.map((team, index) => {
              return (
                <FormControlLabel value={props.allTeams[0].abbreviation} sx={{ width: '100px' }} control={<Checkbox value={team.teamId} checked={props.currentlySelectedTeams.some(selectedTeam => selectedTeam.teamId == team.teamId)} onChange={props.callback}/>} label={team.abbreviation} />
              );
            }
            )
          }
        </Box>
      </Select>
    </FormControl>
  );
}