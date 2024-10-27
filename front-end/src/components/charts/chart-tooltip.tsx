import BaseRisenBox from '../risen-box/base-risen-box';
import React from 'react';

interface ChartTooltipsProps {
    active: boolean;
    payload: any[]
    label: string
}

export default function ChartTooltip(props: ChartTooltipsProps) {
  if (!props.active || !props.payload || props.payload.length === 0) {
    return null;
  }

  const sortedPayload = [...props.payload].sort((a, b) => b.value - a.value);

  return (
    <BaseRisenBox hideDivider={true}>
      {sortedPayload.map((entry: any, index: number) => (
        <p key={`tooltip-item-${index}`} style={{ color: entry.color, margin: 0 }}>
          {entry.name}: <strong>{entry.value}</strong>
        </p>
      ))}
    </BaseRisenBox>
  );

}