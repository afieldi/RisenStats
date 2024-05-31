import { useTheme } from '@emotion/react';
import { Theme, Typography } from '@mui/material';
import { calculateWR } from '../../../../Common/utils';
import BaseRisenBox from '../risen-box/base-risen-box';
import {
  Bar,
  ComposedChart,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import React from 'react';
import { getGradient } from '../league-page/general';

interface SideWinRateBoxProps {
    blueWins: number;
    blueLosses: number;
    redWins: number
    redLosses: number
    hasData: boolean;
}

export default function SideWinRateBox(winRateProps: SideWinRateBoxProps) {
  const theme = useTheme() as Theme;

  let redWinrate = calculateWR({ totalGames: winRateProps.redWins + winRateProps.redLosses, totalWins: winRateProps.redWins });
  let blueWinrate = calculateWR({ totalGames: winRateProps.blueWins + winRateProps.blueLosses, totalWins: winRateProps.blueWins });

  const data = [
    {
      red: redWinrate,
      blue: blueWinrate,
    }
  ];

  return (
    <BaseRisenBox sx={{ minWidth: 280, minHeight: 100, flexGrow: 1,background: getGradient(theme.palette.risenBoxBg.main) }} title="Side Win Rate">
      {!winRateProps.hasData && <Typography color={theme.palette.info.light} variant="h3">No Data</Typography>}
      <ComposedChart
        layout="vertical"
        width={250}
        height={180}
        data={data}
        margin={{
          top: 20,
          right: 20,
          bottom: 20,
          left: -40,
        }}
      >
        <Tooltip/>
        <XAxis type="number" hide={true}/>
        <YAxis dataKey="name" type="category" scale="band"/>
        <Bar dataKey="red" barSize={50} unit={`% (${winRateProps.redWins + winRateProps.redLosses})`} fill="#640713" />
        <Bar dataKey="blue" barSize={50} unit={`% (${winRateProps.blueWins + winRateProps.blueLosses})`} fill="#010144" />
      </ComposedChart>
    </BaseRisenBox>
  );
}