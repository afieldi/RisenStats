import BaseRisenBox from '../risen-box/base-risen-box';
import React from 'react';
import { Box } from '@mui/system';
import StockTimelineTicker from './stock-timeline-ticker';

interface ChartTooltipsProps {
    active: boolean;
    payload: any[]
    label: string
}

export default function StockTimelineChartTooltip(props: ChartTooltipsProps) {
  if (!props.active || !props.payload || props.payload.length === 0) {
    return null;
  }

  const sortedPayload = [...props.payload].sort((a, b) => b.value - a.value);

  return (
    <BaseRisenBox hideDivider={true}>
      {sortedPayload.map((entry: any, index: number) => (
        <Box sx={{ display: 'flex', flexDirection: 'row' }}>
          <StockTimelineTicker color={entry.color} index={index} tickerSymbol={entry.name} textColor={'#fff'}/>
          <Box sx={{ paddingLeft: '5px', alignContent: 'center' }}>{entry.value}</Box>
        </Box>
      ))}
    </BaseRisenBox>
  );

}