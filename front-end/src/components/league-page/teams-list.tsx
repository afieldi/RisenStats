import { useTheme } from '@emotion/react';
import { Theme, Typography } from '@mui/material';
import React from 'react';
import TeamModel from '../../../../Common/models/team.model';
import { Box } from '@mui/system';
import { darken } from '@mui/system/colorManipulator';
import { calculateWR } from '../../../../Common/utils';
import { getRankColorByPercent } from '../../common/utils';
import LeaderboardCard from './leaderboard/leaderboardCard';
import {
  buildTextBasedLeaderboardHeader,
  buildTextBasedLeaderboardRowPropsWithRedirect,
  LeaderboardRowProps,
  RowMainValue
} from './leaderboard/row';
import { useNavigate } from 'react-router-dom';

interface TeamsListProps {
    teams: TeamModel[]
}

export default function TeamListBox(props: TeamsListProps) {
  const theme = useTheme() as Theme;
  const navigate = useNavigate();

  props.teams.sort((a, b) => {
    return calculateWR({ totalGames: b.win + b.loss, totalWins: b.win }) - calculateWR({ totalGames: a.win + a.loss, totalWins: a.win });
  });

  const leaderboardHeaders = buildTextBasedLeaderboardHeader('Name', 'Games', 'Win Rate', theme);

  let leaderboardRows: LeaderboardRowProps[] = [];

  for (let team of props.teams) {

    let mainValue: RowMainValue = {
      value: calculateWR({ totalGames: team.win + team.loss, totalWins: team.win }),
      formatter: (value: number) => `${value}%`
    };
    leaderboardRows.push(buildTextBasedLeaderboardRowPropsWithRedirect(team.abbreviation, `${team.win}W ${team.loss}L`, mainValue, theme, getRankColorByPercent, () => navigate(`${team.abbreviation}`)));
  }

  let title = <Typography sx={{ pl: 1 }} fontFamily="Montserrat" variant='h6' align='left' color={theme.palette.info.main}>TEAMS</Typography>;

  return (
    <LeaderboardCard width={280} height={280} sortedRowProps={leaderboardRows} header={leaderboardHeaders} title={title}/>
  );
}