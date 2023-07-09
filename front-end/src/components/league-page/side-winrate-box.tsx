import { useTheme } from '@emotion/react';
import { Theme, Typography } from '@mui/material';
import { calculateWR } from '../../../../Common/utils';
import BaseRisenBox from '../risen-box/base-risen-box';
import { Cell, Label, Pie, PieChart, Tooltip } from 'recharts';
import React from 'react';
import { darken } from '@mui/system/colorManipulator';
import { getGradient } from './general';
import PlayerGameModel from '../../../../Common/models/playergame.model';

export interface SideWinRateBoxProps {
    games: PlayerGameModel[]
}

export default function SideWinrateBox(props: SideWinRateBoxProps) {
  const theme = useTheme() as Theme;

  const sideWinrate = buildWinrate(props.games);

  const data = [
    { name: 'Blue Wins', value: sideWinrate.blueWin, color: '#010144' },
    { name: 'Red Wins', value: sideWinrate.redWin, color: '#640713' }
  ];
  const totalGames = sideWinrate.redWin + sideWinrate.blueWin;
  //  const winRate = calculateWR({ totalWins: winRateProps.wins, totalGames: winRateProps.wins + winRateProps.losses }, 1);
  return (
    <BaseRisenBox sx={{ minWidth: 280, minHeight: 280, flexGrow: 1, background: getGradient(theme.palette.risenBoxBg.main) }} title="Side Win Rate">
      <PieChart width={240} height={200} style={{ margin: 'auto' }}>
        <Pie
          data={data}
          innerRadius={65}
          outerRadius={95}
          cx={'50%'}
          cy={'50%'}
          blendStroke={true}
          dataKey={'value'}>
          <Label value={totalGames}
            position="centerBottom"
            className='label-top'
            style={{ fill: theme.palette.info.dark, fontSize: '35px' }}/>
          <Label value={'Total Games'}
            position="centerTop"
            className='label'
            style={{ fill: theme.palette.info.dark }}/>
          {
            data.map((entry, index) => <Cell key={index} fill={entry.color}/>)
          }
        </Pie>
        <Tooltip/>
      </PieChart>
    </BaseRisenBox>
  );
}

function buildWinrate(games: PlayerGameModel[]) {
  let gamesChecked: Set<number> = new Set<number>();
  let blueWin = 0;
  let redWin = 0;
  for(let game of games) {
    if (gamesChecked.has(game.gameGameId)) {
      continue;
    }

    // Only add the game if we found the winning game
    if (game.win) {
      blueWin += game.teamId == 200 ? 1 : 0;
      redWin += game.teamId == 100 ? 1 : 0;
      gamesChecked.add(game.gameGameId);
    }
  }
  return { blueWin, redWin };
}