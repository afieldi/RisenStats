import { useTheme } from '@emotion/react';
import { Theme, Typography } from '@mui/material';
import React from 'react';
import TeamModel from '../../../../Common/models/team.model';
import { Box } from '@mui/system';
import { darken } from '@mui/system/colorManipulator';
import { calculateWR } from '../../../../Common/utils';
import { getRankColorByPercent } from '../../common/utils';
import { getGradient } from './general';

interface TeamsListProps {
    seasonId: number,
    teams: TeamModel[]
}

export default function TeamListBox(props: TeamsListProps) {
  const theme = useTheme() as Theme;

  props.teams.sort((a, b) => {
    return calculateWR({ totalGames: b.win + b.loss, totalWins: b.win }) - calculateWR({ totalGames: a.win + a.loss, totalWins: a.win });
  });

  const nameHeader = <Typography sx={{ paddingLeft: 2 }} variant='subtitle2' align='left' color={theme.palette.info.main}>Name</Typography>;
  const gamesHeader= <Typography sx={{ minWidth: 60 }} variant='subtitle2' align='left' color={theme.palette.info.main}>Games</Typography>;
  const wrHeader = <Typography sx={{ minWidth: 60, paddingRight: 1 }} variant='subtitle2' align='left' color={theme.palette.info.main}>Win Rate</Typography>;

  return (
    <Box sx={{ minWidth: 280,
      minHeight: 280,
      flexGrow: 1,
      flexWrap: 'wrap',
    }}>
      <Box sx={{ p: 0.2, borderRadius: '4px 4px 0px 0px', background: getGradient(theme.palette.risenBoxBg.main)  }}>
        <Typography sx={{ pl: 1 }} fontFamily="Montserrat" variant='h6' align='left' color={theme.palette.info.main}>TEAMS</Typography>
        <hr/>
      </Box>
      <Box sx={{ background: getGradient(theme.palette.risenBoxBg.main) }}>
        {TeamRow(darken(theme.palette.risenBoxBg.main, 0), nameHeader, gamesHeader, wrHeader)}
        {props.teams.map((team, index) => TeamRowTeam(team, theme, index))}
      </Box>
      <Box sx={{ p: 1, borderRadius: '0px 0px 4px 4px', background: getGradient(theme.palette.risenBoxBg.main) }}/>
    </Box>
  );
}

function TeamRowTeam(team: TeamModel, theme: Theme, index: number) {
  const background =  index % 2 === 0 ? darken(theme.palette.risenBoxBg.main, 0.13) : darken(theme.palette.risenBoxBg.main, 0);
  const winrate = calculateWR({ totalGames: team.win + team.loss, totalWins: team.win });
  const name = <Typography sx={{ paddingLeft: 2 }} fontWeight="bold" variant='body2' align='left'>{team.abbreviation}</Typography>;
  const games= <Typography sx={{ minWidth: 80 }} variant='body2' align='center' color={theme.palette.info.main}>{`${team.win}W ${team.loss}L`}</Typography>;
  const wr = <Typography sx={{ minWidth: 60, paddingRight: 1 }} fontWeight="bold" variant='body2' align='center' color={getRankColorByPercent(winrate, theme)}>{`${winrate}%`}</Typography>;
  return TeamRow(background, name, games, wr);
}

function TeamRow(bgColor: string, nameTypography: React.ReactNode, gamesTypography: React.ReactNode, wrTypography: React.ReactNode) {
  return (
    <Box sx={{ pt: 0.5, pb: 0.5, display: 'flex', flexDirection: 'row', justifyContent:'space-between', background: getGradient(bgColor) }}>
      {nameTypography}
      <Box sx={{ minWidth: 110, display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
        {gamesTypography}
        {wrTypography}
      </Box>
    </Box>
  );
}