import { SxProps, Theme,  useTheme } from '@mui/material';
import { Box } from '@mui/material';
import { getGradient } from '../../../common/utils';
import { darken } from '@mui/system/colorManipulator';
import React from 'react';
import { LeaderboardRowProps, Row } from './row';


interface LeaderboardCardProps {
    sortedRowProps: LeaderboardRowProps[]
    header: LeaderboardRowProps,
    title: React.ReactNode,
    sx?: SxProps<Theme> | undefined;
}

export default function LeaderboardCard(props: LeaderboardCardProps) {
  const theme = useTheme() as Theme;

  let sxFinal: SxProps<Theme> = { ...{
    flexGrow: 1,
    flexWrap: 'wrap',
  }, ...props.sx };

  return (
    <Box sx={sxFinal}>
      <Box sx={{ p: 0.2, borderRadius: '4px 4px 0px 0px', background: getGradient(theme.palette.risenBoxBg.main)  }}>
        {props.title}
        <hr/>
      </Box>
      <Box sx={{ background: getGradient(theme.palette.risenBoxBg.main) }}>
        { Row(darken(theme.palette.risenBoxBg.main, 0), props.header.identifierElement, props.header.gamesElement, props.header.mainValueElement)}
        { props.sortedRowProps.map((props, index) =>
          Row(index % 2 === 0 ? darken(theme.palette.risenBoxBg.main, 0.13) : darken(theme.palette.risenBoxBg.main, 0), props.identifierElement, props.gamesElement, props.mainValueElement))
        }
      </Box>
      <Box sx={{ p: 1, borderRadius: '0px 0px 4px 4px', background: getGradient(theme.palette.risenBoxBg.main) }}/>
    </Box>
  );
}