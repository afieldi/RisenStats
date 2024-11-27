import StockTimelineTicker from './stock-timeline-ticker';
import React from 'react';
import { Box } from '@mui/system';

export function StockTimelineLegend(props: any) {
  const { payload, onClick } = props;

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', flexDirection: 'row' }}>
      {payload.map((entry: any, index: number) => (
        <Box onClick={() => onClick(entry)} >
          <StockTimelineTicker tickerSymbol={entry.value} index={index} color={!entry.inactive ? entry.color : null } textColor={!entry.inactive ? 'white' : entry.color}></StockTimelineTicker>
        </Box>
      ))}
    </Box>
  );
}