import { useTheme } from '@emotion/react';
import { Theme, Typography } from '@mui/material';
import { calculateWR } from '../../../../Common/utils';
import BaseRisenBox from '../risen-box/base-risen-box';
import { Cell, Label, Pie, PieChart, Tooltip } from 'recharts';
import React from 'react';
import { darken } from '@mui/system/colorManipulator';
import { getGradient } from './general';

export interface SideWinRateBoxProps {
    redWins: number;
    blueWins: number;
    hasData: boolean;
}

export default function SideWinrateBox(props: SideWinRateBoxProps) {
  const theme = useTheme() as Theme;

  const data = [
    { name: 'Blue Wins', value: props.blueWins, color: '#010144' },
    { name: 'Red Wins', value: props.redWins, color: '#640713' }
  ];
  const totalGames = props.redWins + props.blueWins;
  //  const winRate = calculateWR({ totalWins: winRateProps.wins, totalGames: winRateProps.wins + winRateProps.losses }, 1);
  return (
    <BaseRisenBox sx={{ minWidth: 280, minHeight: 280, flexGrow: 1, background: getGradient(theme.palette.risenBoxBg.main) }} title="Side Win Rate">
      {!props.hasData && <Typography color={theme.palette.info.light} variant="h3">No Data</Typography>}
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