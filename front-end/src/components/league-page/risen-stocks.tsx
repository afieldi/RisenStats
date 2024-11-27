import { Typography } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';
import { StockTimelineEntry } from '../../../../Common/Interface/Internal/stocks';
import TeamModel from '../../../../Common/models/team.model';
import StockTimelineChart from '../charts/stock-timeline-chart';


interface RisenStocksProps {
    stockTimeline: Map<number, StockTimelineEntry[]>
    teams: Map<number, TeamModel>
}

export default function RisenStocks(props: RisenStocksProps) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column',  flexWrap: 'wrap', rowGap: 0.5, maxWidth: '100%' }}>
      <Box sx={{ p: 0.2, display: 'flex', flexDirection: 'column', minWidth: 880 }}>
        <Typography fontFamily="Montserrat" variant='h4' align='left'>Risen Stocks</Typography>
        <hr style={{ width: '100%' }}></hr>
      </Box>
      <Box sx={{ height: '460px' }}>
        <StockTimelineChart  stockTimeline={props.stockTimeline} teams={props.teams}/>
      </Box>
    </Box>
  );
}