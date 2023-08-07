import { Box, Theme, Typography, useTheme } from '@mui/material';
import React from 'react';
import PlayerGameModel from '../../../../Common/models/playergame.model';
import { roundTo } from '../../../../Common/utils';
import {
  buildImageBasedLeaderboardRowProps,
  buildTextBasedLeaderboardHeader,
  LeaderboardRowProps,
  RowMainValue
} from './leaderboard/row';
import LeaderboardCard from './leaderboard/leaderboardCard';

interface LeagueChampionWinrates {
    games: PlayerGameModel[]
}

const amountOfChampsToShow = 6;

export default function LeagueChampionWinrates(props: LeagueChampionWinrates) {
  const theme = useTheme() as Theme;

  let orderedWinrate = buildLeagueChampWinrates(props.games);

  const sortedWinrates = [...orderedWinrate.entries()].map(([championId, { wins, games }]) => {
    const winrate = wins / games;
    return { championId, wins, games, winrate };
  })
    .sort((a, b) => b.winrate - a.winrate)
    .filter(champ => champ.games >= 4);

  return (
    <Box sx={{ minWidth: 560, minHeight: 280, display: 'flex', columnGap: 2, rowGap: 1, flexWrap: 'wrap' }}>
      { getChampionWinrateCard('Highest Winrate Champs',  sortedWinrates.slice(0, amountOfChampsToShow) ) }
      { getChampionWinrateCard('Lowest Winrate Champs', sortedWinrates.slice(-amountOfChampsToShow).reverse()) }
    </Box>
  );
}

function getChampionWinrateCard(titleString: string, orderedWinrate: {championId: number, wins: number, games: number, winrate: number}[]) {
  const theme = useTheme() as Theme;

  let ordereredLeaderboardRowProps: LeaderboardRowProps[] = [];
  for (let orderedWinrateElement of orderedWinrate) {

    let rowMainValue: RowMainValue = {
      value: roundTo(orderedWinrateElement.winrate * 100, 1),
      formatter: (value) => `${value}%`
    };

    ordereredLeaderboardRowProps.push(buildImageBasedLeaderboardRowProps(
      `/images/champions/icons/${orderedWinrateElement.championId}_0.png`, `
          ${orderedWinrateElement.championId}`,
      orderedWinrateElement.games,
      rowMainValue,
      theme,
      (v, theme) => ''));
  }

  const leaderboardHeaders = buildTextBasedLeaderboardHeader('Champion', 'Games', 'Win Rate', theme);
  const title = <Typography sx={{ pl: 1 }} fontFamily="Montserrat" variant='subtitle1' align='left' color={theme.palette.info.main}>{titleString}</Typography>;

  return (
    <LeaderboardCard sx={{ maxWidth: 270 }} sortedRowProps={ordereredLeaderboardRowProps} header={leaderboardHeaders} title={title}/>
  );
}

function buildLeagueChampWinrates(games: PlayerGameModel[]) {
  const champWinrates = new Map<number, { wins: number, games: number }>();

  for (const game of games) {
    const { championId, win } = game;
    const winrate = champWinrates.get(championId) || { wins: 0, games: 0 };

    winrate.wins += win ? 1 : 0;
    winrate.games++;

    champWinrates.set(championId, winrate);
  }

  return champWinrates;
}