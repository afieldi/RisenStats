import { useTheme } from '@emotion/react';
import { Box, Theme, Typography } from '@mui/material';
import React from 'react';
import { getGradient } from '../../common/utils';
import BaseRisenBox from '../risen-box/base-risen-box';
import { riotTimestampToGameTime,  roundTo } from '../../../../Common/utils';
import PlayerGameModel from '../../../../Common/models/playergame.model';

interface LeagueStatsProps {
    games: PlayerGameModel[]
    uniqueChampions: number,
}
export default function LeagueStats(props: LeagueStatsProps) {
  const theme = useTheme() as Theme;

  const leagueStats = buildLeagueStats(props.games);

  return (
    <Box sx={{ display: 'flex', columnGap: 2, rowGap: 1, flexWrap: 'wrap' }}>
      {getCard(theme, riotTimestampToGameTime(leagueStats.totalDuration / leagueStats.totalGames), 'Average Game Time')}
      {getCard(theme, roundTo(leagueStats.kills/leagueStats.totalGames), 'Average Kills Per Game')}
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

function buildLeagueStats(games: PlayerGameModel[]) {
  let gamesChecked: Set<number> = new Set<number>();
  let kills = 0;
  let deaths = 0;
  let totalGames = 0;
  let totalDuration = 0;

  for(let game of games) {
    // Only add these stats once per a given match
    if (!gamesChecked.has(game.gameGameId)) {
      totalDuration += game.gameLength;
      totalGames +=1;
    }
    kills += game.kills;
    deaths += game.deaths;


    gamesChecked.add(game.gameGameId);
  }
  return { kills, deaths, totalGames, totalDuration };
}