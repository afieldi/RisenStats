import React from 'react';
import { PieChart, Pie, Cell } from 'recharts';
import { NonNone } from '../../../../Common/utils';

interface Props {
  height?: number,
  width?: number,
  wins: number,
  losses: number,
}

export default function WinRatePieChart({height, width, wins, losses}: Props) {
  const data = [
    {
      "name": "Wins",
      "value": +wins
    },
    {
      "name": "Losses",
      "value": +losses
    }
  ];
  const COLORS = [
    "#2039f5",
    "#b80707"
  ]
  return (
    <PieChart height={NonNone(height, 300)} width={NonNone(width, NonNone(height, 300))}>
      <Pie data={data} dataKey="value" nameKey="name" fill="#8884d8" outerRadius={NonNone(height, 300) * .5}>
      {
        data.map((entry, index) => <Cell fill={COLORS[index % COLORS.length]}/>)
      }
      </Pie>
    </PieChart>
  )
}