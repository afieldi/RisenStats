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

export interface TeamLeaderboardProps {
    games: PlayerGameModel[]
    teams: Map<number, TeamModel>
}

export interface TeamLeaderboardCardProps {
  titleOfCard: string,
  lbColumnTitle: string,
  orderedleaderboard: Map<number, LeaderboardStats>,
  mainValueCalculator: (value: LeaderboardStats) => number,
  formatter: (value: number) => string
}

interface LeaderboardStats {
  totalGameLength: number;
  totalGamesByTeam: number;
  totalDragonsByTeam: number;
  baronKillsByTeam: number;
  riftHeraldKillsByTeam: number;
  goldDiff15ByTeam: number;
  csDiff15ByTeam: number;
}

const colorChoser = (v: number, theme: Theme) => '';
const howManyRowsToDisplay = 6;
export default function TeamLeaderboards(props: TeamLeaderboardProps) {
  const theme = useTheme() as Theme;

  const leaderboardStats = buildLeaderboardStats(props.games);

  const leaderboardCardProps = getLeaderboardCardProps(leaderboardStats, howManyRowsToDisplay);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column',  flexWrap: 'wrap', rowGap: 0.5, maxWidth: '100%' }}>
      <Box sx={{ p: 0.2, display: 'flex', flexDirection: 'column', minWidth: 880 }}>
        <Typography fontFamily="Montserrat" variant='h4' align='left'>Team Leaderboards</Typography>
        <hr style={{ width: '100%' }}></hr>
      </Box>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', flexDirection: 'row', columnGap: 3 }}>
        {
          [...leaderboardCardProps.keys()].map(key => {
            return TeamLeaderboardCard(leaderboardCardProps.get(key) as TeamLeaderboardCardProps, props.teams);
          })
        }
      </Box>
    </Box>
  );
}

export function TeamLeaderboardCard(props: TeamLeaderboardCardProps, teamMap:Map<number, TeamModel>) {
  const theme = useTheme() as Theme;
  const navigate = useNavigate();

  const leaderboardHeaders = buildTextBasedLeaderboardHeader('Name', 'Games', props.lbColumnTitle, theme);

  let leaderboardRows: LeaderboardRowProps[] = [];

  props.orderedleaderboard.forEach((value, key) => {
    let team = teamMap.get(key) as TeamModel;

    let mainValue: RowMainValue = {
      value: props.mainValueCalculator(value),
      formatter: props.formatter
    };
    leaderboardRows.push(buildTextBasedLeaderboardRowPropsWithRedirect(team.abbreviation, `${roundTo(value.totalGamesByTeam/5, 0)}`, mainValue, theme, colorChoser, () => navigate(`${team.abbreviation}`)));
  });

  let title = <Typography sx={{ pl: 1 }} fontFamily="Montserrat" variant='h6' align='left' color={theme.palette.info.main}>{props.titleOfCard}</Typography>;

  return (
    <LeaderboardCard sx={{ minWidth: 270, maxWidth: 275, minHeight: 280, maxHeight: 320 }} sortedRowProps={leaderboardRows} header={leaderboardHeaders} title={title}/>
  );
}

export function getLeaderboardCardProps(leaderboardStats: Map<number, LeaderboardStats>, howManyToDisplay: number): Map<String, TeamLeaderboardCardProps> {

  const leaderboardCardProps: Map<string, TeamLeaderboardCardProps> = new Map();

  // CSD15
  const sortedEntriesCSD15 = [...leaderboardStats.entries()]
    .sort((a, b) => (b[1].csDiff15ByTeam / b[1].totalGamesByTeam) - (a[1].csDiff15ByTeam / a[1].totalGamesByTeam))
    .slice(0, howManyToDisplay);

  leaderboardCardProps.set('CSD15', {
    titleOfCard: 'CSD @15',
    lbColumnTitle: 'CSD15',
    orderedleaderboard: new Map(sortedEntriesCSD15),
    mainValueCalculator: (leaderboardStat: LeaderboardStats) => roundTo((leaderboardStat.csDiff15ByTeam / leaderboardStat.totalGamesByTeam) * 5), // Multiply to 5 to account for 5 players
    formatter: (v: number) => `${v}`
  });

  // Average GameTime
  const sortedEntriesAvgGameTime = [...leaderboardStats.entries()]
    .sort((a, b) => (a[1].totalGameLength/a[1].totalGamesByTeam) - (b[1].totalGameLength/b[1].totalGamesByTeam))
    .slice(0, howManyToDisplay);

  leaderboardCardProps.set('Game Time', {
    titleOfCard: 'Average Game Time',
    lbColumnTitle: 'Time',
    orderedleaderboard: new Map(sortedEntriesAvgGameTime),
    mainValueCalculator: (leaderboardStat: LeaderboardStats) => leaderboardStat.totalGameLength / leaderboardStat.totalGamesByTeam,
    formatter: (gameTime: number) => `${riotTimestampToGameTime(gameTime)}`
  });

  // GoldDiff15
  const sortedEntriesGD15 = [...leaderboardStats.entries()]
    .sort((a, b) => ((b[1].goldDiff15ByTeam/b[1].totalGamesByTeam) - (a[1].goldDiff15ByTeam/a[1].totalGamesByTeam)))
    .slice(0, howManyToDisplay);

  leaderboardCardProps.set('GD15', {
    titleOfCard: 'Gold Diff @15',
    lbColumnTitle: 'GD15',
    orderedleaderboard: new Map(sortedEntriesGD15),
    mainValueCalculator: (leaderboardStat: LeaderboardStats) => roundTo((leaderboardStat.goldDiff15ByTeam / leaderboardStat.totalGamesByTeam) * 5), // Multiply to 5 to account for 5 players
    formatter: (v: number) => `${v}`
  });

  // Average Dragons
  const sortedEntriesDragons = [...leaderboardStats.entries()]
    .sort((a, b) => ((b[1].totalDragonsByTeam/b[1].totalGamesByTeam) - (a[1].totalDragonsByTeam/a[1].totalGamesByTeam)))
    .slice(0, howManyToDisplay);

  leaderboardCardProps.set('Dragons', {
    titleOfCard: 'Average Dragons',
    lbColumnTitle: 'Drags',
    orderedleaderboard: new Map(sortedEntriesDragons),
    mainValueCalculator: (leaderboardStat: LeaderboardStats) => roundTo((leaderboardStat.totalDragonsByTeam / leaderboardStat.totalGamesByTeam) * 5), // Multiply to 5 to account for 5 players
    formatter: (v: number) => `${v}`
  });

  // Average Rift
  const sortedEntriesRiftHerald = [...leaderboardStats.entries()]
    .sort((a, b) => ((b[1].riftHeraldKillsByTeam/b[1].totalGamesByTeam) - (a[1].riftHeraldKillsByTeam/a[1].totalGamesByTeam)))
    .slice(0, howManyToDisplay);

  leaderboardCardProps.set('Rift Heralds', {
    titleOfCard: 'Average Rift Heralds',
    lbColumnTitle: 'Herald',
    orderedleaderboard: new Map(sortedEntriesRiftHerald),
    mainValueCalculator: (leaderboardStat: LeaderboardStats) => roundTo((leaderboardStat.riftHeraldKillsByTeam / leaderboardStat.totalGamesByTeam) * 5), // Multiply to 5 to account for 5 players
    formatter: (v: number) => `${v}`
  });

  // Average Rift
  const sortedEntriesBarons = [...leaderboardStats.entries()]
    .sort((a, b) => ((b[1].baronKillsByTeam/b[1].totalGamesByTeam) - (a[1].baronKillsByTeam/a[1].totalGamesByTeam)))
    .slice(0, howManyToDisplay);

  leaderboardCardProps.set('Barons', {
    titleOfCard: 'Average Barons',
    lbColumnTitle: 'Barons',
    orderedleaderboard: new Map(sortedEntriesBarons),
    mainValueCalculator: (leaderboardStat: LeaderboardStats) => roundTo((leaderboardStat.baronKillsByTeam / leaderboardStat.totalGamesByTeam) * 5), // Multiply to 5 to account for 5 players
    formatter: (v: number) => `${v}`
  });

  return leaderboardCardProps;
}

function buildLeaderboardStats(games: PlayerGameModel[]): Map<number, LeaderboardStats> {
  const leaderboardStatsMap = new Map<number, LeaderboardStats>();

  for (const game of games) {
    const { risenTeamTeamId } = game;
    if (risenTeamTeamId) {
      const existingStats = leaderboardStatsMap.get(risenTeamTeamId) || {
        totalGameLength: 0,
        totalGamesByTeam: 0,
        totalDragonsByTeam: 0,
        baronKillsByTeam: 0,
        riftHeraldKillsByTeam: 0,
        goldDiff15ByTeam: 0,
        csDiff15ByTeam: 0,
      };

      const updatedStats: LeaderboardStats = {
        totalGameLength: existingStats.totalGameLength + game.gameLength,
        totalGamesByTeam: existingStats.totalGamesByTeam + 1,
        totalDragonsByTeam:
            existingStats.totalDragonsByTeam +
            game.oceanDragonKills +
            game.cloudDragonKills +
            game.mountainDragonKills +
            game.infernalDragonKills +
            game.hextechDragonKills +
            game.chemtechDragonKills +
            game.elderDragonKills,
        baronKillsByTeam: existingStats.baronKillsByTeam + game.baronKills,
        riftHeraldKillsByTeam: existingStats.riftHeraldKillsByTeam + game.riftHeraldKills,
        goldDiff15ByTeam: existingStats.goldDiff15ByTeam + game.goldDiff15,
        csDiff15ByTeam: existingStats.csDiff15ByTeam + game.csDiff15,
      };
      leaderboardStatsMap.set(risenTeamTeamId, updatedStats);
    }
  }
  return leaderboardStatsMap;
}
