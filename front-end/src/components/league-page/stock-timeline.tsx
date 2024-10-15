import { Theme, Typography, useTheme } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';
import { CartesianGrid, Label, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { StockTimelineEntry } from '../../../../Common/Interface/Internal/stocks';
import TeamModel from '../../../../Common/models/team.model';


interface StockTimeLineProps {
  stockTimeline: Map<number, StockTimelineEntry[]>
  teams: Map<number, TeamModel>
}

export default function StockTimeline(props: StockTimeLineProps): JSX.Element {
  const stockTimeline = mapTeamIdToAbbreviation(props.teams, props.stockTimeline);

  const dateFormatter = (dateTime: any) => {
    return new Date(dateTime).toISOString();
  };

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <XAxis type={'number'} dataKey={'timestamp'} domain={['auto', 'auto']} tickFormatter={dateFormatter}/>
        <YAxis dataKey={'value'} domain={['auto', 'auto']}/>
        <Tooltip />
        <Legend />
        {Array.from(stockTimeline.keys()).map((key) => (
          <Line
            key={key}
            type="monotone"
            data={groupDataByHour(stockTimeline.get(key) as StockTimelineEntry[])}
            dataKey={'value'}
            stroke={`#${Math.floor(Math.random() * stringToNumber(key)).toString(16)}`}
            connectNulls={false}
            isAnimationActive={true}
            dot={false}
            name={key}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}

function stringToNumber(input: string): number {
  // Convert each character to its ASCII code and combine them into a number
  const charCodes = input.split('').map(char => char.charCodeAt(0));
  return  charCodes[0] * 26 * 26 + charCodes[1] * 26 + charCodes[2] * 6000;
}

function mapTeamIdToAbbreviation(teamMap: Map<number, TeamModel>, timeline: Map<number, StockTimelineEntry[]>): Map<string, StockTimelineEntry[]> {
  let timeLineWithTeamAbbr: Map<string, StockTimelineEntry[]> = new Map();

  for (let timelineElement of timeline) {
    let teamId = timelineElement[0];
    let team =   teamMap.get(teamId) as TeamModel;
    timeLineWithTeamAbbr.set(team.abbreviation, timelineElement[1]);
  }

  return timeLineWithTeamAbbr;
}

function groupDataByHour(stockTimeline: StockTimelineEntry[]) {
  const roundToHour = (date: Date): Date => {
    const newDate = new Date(date);
    // newDate.setMinutes(0, 0, 0); // Set minutes, seconds, and milliseconds to 0
    // newDate.setMinutes(0,0,0);
    // newDate.setHours(0,0,0);
    return newDate;
  };

  return stockTimeline.map(entry => ({
    ...entry,
    timestamp: roundToHour(entry.timestamp).getTime()
  }));

}