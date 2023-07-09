import { Box, Theme, Typography, useTheme } from '@mui/material';
import { getGradient } from './general';
import React from 'react';
import PlayerGameModel from '../../../../Common/models/playergame.model';
import ImgBox from '../risen-box/img-box';
import { darken } from '@mui/system/colorManipulator';
import { roundTo } from '../../../../Common/utils';

interface LeagueChampionWinrates {
    games: PlayerGameModel[]
}
export default function LeagueChampionWinrates(props: LeagueChampionWinrates) {
  const theme = useTheme() as Theme;

  let orderedWinrate = buildLeagueChampWinrates(props.games);

  const sortedWinrates = [...orderedWinrate.entries()].map(([championId, { wins, games }]) => {
    const winrate = wins / games;
    return { championId, wins, games, winrate };
  })
    .sort((a, b) => b.winrate - a.winrate)
    .filter(champ => champ.games >= 4);

  console.log(sortedWinrates);

  return (
    <Box sx={{ minWidth: 560, minHeight: 280, display: 'flex', columnGap: 2, rowGap: 1, flexWrap: 'wrap' }}>
      { getChampionWinrateCard('Highest Winrate Champs',  sortedWinrates.slice(0, 6) ) }
      { getChampionWinrateCard('Lowest Winrate Champs', sortedWinrates.slice(-6).reverse()) }
    </Box>
  );
}

// TODO maybe this can be refactored to use the teamslist card?
function getChampionWinrateCard(titleString: string, orderedWinrate: {championId: number, wins: number, games: number, winrate: number}[]) {
  const theme = useTheme() as Theme;
  return (
    <Box sx={{ minWidth: 100, minHeight: 280, flexGrow: 1 }}>
      <Box sx={{ p: 0.5, borderRadius: '4px 4px 0px 0px', background: getGradient(theme.palette.risenBoxBg.main)  }}>
        <Typography sx={{ pl: 1 }} fontFamily="Montserrat" variant='subtitle1' align='left' color={theme.palette.info.main}>{titleString}</Typography>
        <hr/>
      </Box>
      <Box sx={{ background: getGradient(theme.palette.risenBoxBg.main) }}>
        {header(darken(theme.palette.risenBoxBg.main, 0))}
        {orderedWinrate.map((champ, index) => row(champ.championId, champ.winrate * 100, champ.games, index))}
      </Box>
      <Box sx={{ p: 1, borderRadius: '0px 0px 4px 4px', background: getGradient(theme.palette.risenBoxBg.main) }}/>

    </Box>
  );
}

function row(championId: number, winrate: number, games: number, index: number) {
  const theme = useTheme() as Theme;

  const background =  index % 2 === 0 ? darken(theme.palette.risenBoxBg.main, 0.13) : darken(theme.palette.risenBoxBg.main, 0);

  return (
    <Box sx={{ pt: 0.5, pb: 0.5, paddingLeft: 2, display: 'flex', flexDirection: 'row', justifyContent:'space-between', background: getGradient(background) }}>
      <ImgBox
        sx={{ height:25, width: 25 }}
        alt={`${championId}`}
        src={`/images/champions/icons/${championId}_0.png`}
        height="25px"
        width="25px"
      />
      <Box sx={{ minWidth: 70, display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
        <Typography sx={{ minWidth: 80 }} variant='body2' align='center' color={theme.palette.info.main}>{games}</Typography>
        <Typography sx={{ minWidth: 60, paddingRight: 1 }} fontWeight="bold" variant='body2' align='center' >{`${roundTo(winrate, 1)}%`}</Typography>
      </Box>
    </Box>
  );
}

function header(bgColor: string) {
  const theme = useTheme() as Theme;
  return (
    <Box sx={{ pt: 0.5, pb: 0.5, display: 'flex', flexDirection: 'row', justifyContent:'space-between', background: getGradient(bgColor) }}>
      <Typography sx={{ minWidth: 60, paddingLeft: 2 }} variant='subtitle2' align='left' color={theme.palette.info.main}>Champion</Typography>
      <Box sx={{ minWidth: 70, display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
        <Typography sx={{ minWidth: 60 }} variant='subtitle2' align='left' color={theme.palette.info.main}>Games</Typography>
        <Typography sx={{ minWidth: 60, paddingRight: 1 }} variant='subtitle2' align='left' color={theme.palette.info.main}>Win Rate</Typography>
      </Box>
    </Box>
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