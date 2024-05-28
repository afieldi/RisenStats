import { useTheme } from '@emotion/react';
import { Theme, Typography } from '@mui/material';
import React from 'react';
import PlayerGameModel from '../../../../Common/models/playergame.model';
import TeamModel from '../../../../Common/models/team.model';
import {
  buildTextBasedLeaderboardHeader, buildTextBasedLeaderboardRowPropsWithRedirect,
  LeaderboardRowProps,
  RowMainValue
} from './leaderboard/row';
import { riotTimestampToGameTime, roundTo } from '../../../../Common/utils';
import LeaderboardCard from './leaderboard/leaderboardCard';
import { Box } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import {
  getDisplayValueForTeamLeaderboardForAverage,
  getRisenTeamGameCountForLeague,
  getRisenTeamStatForLeague, sortRisenTeamStatEntriesAscending, sortRisenTeamStatEntriesDescending
} from '../../common/stats-generators/team/RisenTeamStatGenerator';

export interface TeamLeaderboardProps {
    games: PlayerGameModel[]
    teams: Map<number, TeamModel>
}

export interface TeamLeaderboardCardProps {
  titleOfCard: string,
  lbColumnTitle: string,
  orderedleaderboard: Map<number, number>,
  mainValueCalculator: (value: number, teamId: number) => number,
  formatter: (value: number) => string
}

const colorChoser = (v: number, theme: Theme) => '';
const howManyRowsToDisplay = 6;
export default function TeamLeaderboards(props: TeamLeaderboardProps) {
  const theme = useTheme() as Theme;


  const gameCounts = getRisenTeamGameCountForLeague(props.games);
  const leaderboardCardProps = getLeaderboardCardProps(props.games, gameCounts, howManyRowsToDisplay);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column',  flexWrap: 'wrap', rowGap: 0.5, maxWidth: '100%' }}>
      <Box sx={{ p: 0.2, display: 'flex', flexDirection: 'column', minWidth: 880 }}>
        <Typography fontFamily="Montserrat" variant='h4' align='left'>Team Leaderboards</Typography>
        <hr style={{ width: '100%' }}></hr>
      </Box>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', flexDirection: 'row', columnGap: 3 }}>
        {
          [...leaderboardCardProps.keys()].map(key => {
            return TeamLeaderboardCard(leaderboardCardProps.get(key) as TeamLeaderboardCardProps, props.teams, gameCounts);
          })
        }
      </Box>
    </Box>
  );
}

export function TeamLeaderboardCard(props: TeamLeaderboardCardProps, teamMap:Map<number, TeamModel>, gameCounts: Map<number, number>) {
  const theme = useTheme() as Theme;
  const navigate = useNavigate();

  const leaderboardHeaders = buildTextBasedLeaderboardHeader('Name', 'Games', props.lbColumnTitle, theme);

  let leaderboardRows: LeaderboardRowProps[] = [];

  props.orderedleaderboard.forEach((value, key) => {
    let team = teamMap.get(key) as TeamModel;
    let games = gameCounts.get(key) as number;
    let mainValue: RowMainValue = {
      value: props.mainValueCalculator(value, team.teamId),
      formatter: props.formatter
    };
    leaderboardRows.push(buildTextBasedLeaderboardRowPropsWithRedirect(team.abbreviation, `${roundTo(games/5, 0)}`, mainValue, theme, colorChoser, () => navigate(`${team.abbreviation}`)));
  });

  let title = <Typography sx={{ pl: 1 }} fontFamily="Montserrat" variant='h6' align='left' color={theme.palette.info.main}>{props.titleOfCard}</Typography>;

  return (
    <LeaderboardCard sx={{ minWidth: 270, maxWidth: 275, minHeight: 280, maxHeight: 320 }} sortedRowProps={leaderboardRows} header={leaderboardHeaders} title={title}/>
  );
}

export function getLeaderboardCardProps(games:PlayerGameModel[], gameCountMap: Map<number, number>, howManyToDisplay: number): Map<String, TeamLeaderboardCardProps> {

  const leaderboardCardProps: Map<string, TeamLeaderboardCardProps> = new Map();

  // CSD15
  const sortedEntriesCSD15 = sortRisenTeamStatEntriesDescending(getRisenTeamStatForLeague(games, ['csDiff15']), howManyToDisplay, gameCountMap);

  leaderboardCardProps.set('CSD15', {
    titleOfCard: 'CSD @15',
    lbColumnTitle: 'CSD15',
    orderedleaderboard: new Map(sortedEntriesCSD15),
    mainValueCalculator: (value: number, teamId: number) => getDisplayValueForTeamLeaderboardForAverage(value, teamId, gameCountMap), // Multiply to 5 to account for 5 players
    formatter: (v: number) => `${v}`
  });

  // Average GameTime
  const sortedEntriesAvgGameTime =  sortRisenTeamStatEntriesAscending(getRisenTeamStatForLeague(games, ['gameLength']), howManyToDisplay, gameCountMap);

  leaderboardCardProps.set('Game Time', {
    titleOfCard: 'Average Game Time',
    lbColumnTitle: 'Time',
    orderedleaderboard: new Map(sortedEntriesAvgGameTime),
    mainValueCalculator: (value: number, teamId: number) => value / (gameCountMap.get(teamId) as number),
    formatter: (gameTime: number) => `${riotTimestampToGameTime(gameTime)}`
  });

  // GoldDiff15
  const sortedEntriesGD15 = sortRisenTeamStatEntriesDescending(getRisenTeamStatForLeague(games, ['goldDiff15']), howManyToDisplay, gameCountMap);

  leaderboardCardProps.set('GD15', {
    titleOfCard: 'Gold Diff @15',
    lbColumnTitle: 'GD15',
    orderedleaderboard: new Map(sortedEntriesGD15),
    mainValueCalculator: (value: number, teamId: number) => getDisplayValueForTeamLeaderboardForAverage(value, teamId, gameCountMap),
    formatter: (v: number) => `${v}`
  });

  // Average Dragons
  const sortedEntriesDragons = sortRisenTeamStatEntriesDescending(getRisenTeamStatForLeague(games, ['oceanDragonKills', 'mountainDragonKills', 'chemtechDragonKills', 'elderDragonKills', 'infernalDragonKills', 'hextechDragonKills', 'cloudDragonKills']), howManyToDisplay, gameCountMap);

  leaderboardCardProps.set('Dragons', {
    titleOfCard: 'Average Dragons',
    lbColumnTitle: 'Drags',
    orderedleaderboard: new Map(sortedEntriesDragons),
    mainValueCalculator: (value: number, teamId: number) => getDisplayValueForTeamLeaderboardForAverage(value, teamId, gameCountMap),
    formatter: (v: number) => `${v}`
  });

  // Average Rift
  const sortedEntriesRiftHerald = sortRisenTeamStatEntriesDescending(getRisenTeamStatForLeague(games, ['riftHeraldKills']), howManyToDisplay, gameCountMap);

  leaderboardCardProps.set('Rift Heralds', {
    titleOfCard: 'Average Rift Heralds',
    lbColumnTitle: 'Herald',
    orderedleaderboard: new Map(sortedEntriesRiftHerald),
    mainValueCalculator: (value: number, teamId: number) => getDisplayValueForTeamLeaderboardForAverage(value, teamId, gameCountMap),
    formatter: (v: number) => `${v}`
  });

  // Average Rift
  const sortedEntriesBarons = sortRisenTeamStatEntriesDescending(getRisenTeamStatForLeague(games, ['baronKills']), howManyToDisplay, gameCountMap);

  leaderboardCardProps.set('Barons', {
    titleOfCard: 'Average Barons',
    lbColumnTitle: 'Barons',
    orderedleaderboard: new Map(sortedEntriesBarons),
    mainValueCalculator: (value: number, teamId: number) => getDisplayValueForTeamLeaderboardForAverage(value, teamId, gameCountMap),
    formatter: (v: number) => `${v}`
  });

  // Average Void Grubs
  const sortedEntriesVoidGrubs = sortRisenTeamStatEntriesDescending(getRisenTeamStatForLeague(games, ['voidgrubKills']), howManyToDisplay, gameCountMap);
  leaderboardCardProps.set('Void Grubs', {
    titleOfCard: 'Average Void Grubs',
    lbColumnTitle: 'Grubs',
    orderedleaderboard: new Map(sortedEntriesVoidGrubs),
    mainValueCalculator: (value: number, teamId: number) => getDisplayValueForTeamLeaderboardForAverage(value, teamId, gameCountMap),
    formatter: (v: number) => `${v}`
  });

  // Average Turret Plates
  const sortedEntriesTurretPlates = sortRisenTeamStatEntriesDescending(getRisenTeamStatForLeague(games, ['turretPlatesTaken']), howManyToDisplay, gameCountMap);

  leaderboardCardProps.set('Turret Plates', {
    titleOfCard: 'Average Turret Plates',
    lbColumnTitle: 'Plates',
    orderedleaderboard: new Map(sortedEntriesTurretPlates),
    mainValueCalculator: (value: number, teamId: number) => getDisplayValueForTeamLeaderboardForAverage(value, teamId, gameCountMap),
    formatter: (v: number) => `${v}`
  });

  return leaderboardCardProps;
}
