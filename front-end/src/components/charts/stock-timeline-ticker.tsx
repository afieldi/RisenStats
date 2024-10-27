import BaseRisenBox from '../risen-box/base-risen-box';
import { Box } from '@mui/system';
import React from 'react';

interface StockTimelineTickerProps {
    tickerSymbol: string,
    index: number
    color: string
    textColor: string
}

export default function StockTimelineTicker(props: StockTimelineTickerProps) {

  return (
    <p key={`tooltip-item-${props.index}`}
      style={{
        backgroundColor: props.color,
        color: props.textColor,
        margin: 4,
        padding: '3px 6px',
        borderRadius: '8px',
        textAlign: 'center',
        fontWeight: 'bold',
      }}
    >{props.tickerSymbol}</p>
  );

}