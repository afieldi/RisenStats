import { useTheme } from '@emotion/react';
import { Box, Theme, Typography } from '@mui/material';
import React, { useState } from 'react';
import { getGradient } from './general';
import BaseRisenBox from '../risen-box/base-risen-box';
import { riotTimestampToGameTime, riotTimestampToMinutes, roundTo } from '../../../../Common/utils';

interface LeagueStatsProps {
    kills: number,
    uniqueChampions: number,
    totalDurationRiotTimestamp: number,
    totalGames: number
}
export default function LeagueStats(props: LeagueStatsProps) {
  const theme = useTheme() as Theme;

  return (
    <Box sx={{ display: 'flex', columnGap: 2, rowGap: 1, flexWrap: 'wrap' }}>
      {getCard(theme, riotTimestampToGameTime(props.totalDurationRiotTimestamp / props.totalGames), 'Average Game Time')}
      {getCard(theme, roundTo(props.kills/props.totalGames), 'Average Kills Per Game')}
      {getCard(theme, props.uniqueChampions, 'Unique Champs')}
    </Box>
  );
}

function getCard(theme: Theme, statValue: string | number, statTitle: string) {
  return (
    <BaseRisenBox sx={{ minWidth: 25, minHeight: 170, flexGrow: 1, background: getGradient(theme.palette.risenBoxBg.main) }} hideDivider={true}>
      <Typography color={theme.palette.primary.main} variant="h2">{statValue}</Typography>
      <Typography variant="h6">{statTitle}</Typography>
    </BaseRisenBox>
  );
}