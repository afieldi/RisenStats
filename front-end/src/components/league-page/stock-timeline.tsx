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
  console.log(stockTimeline);


  // Find the minimum and maximum timestamps from the dataset to set the X-axis domain
  const timestamps = Array.from(stockTimeline.values()).flat().map(entry => entry.timestamp);
  const minTimestamp = Math.min(...timestamps);
  const maxTimestamp = Math.max(...timestamps);

  // Date formatter for tooltip and axis
  const dateFormatter = (dateTime: any) => {
    const date = new Date(dateTime);
    return date.toLocaleDateString('en-GB', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart
        margin={{ top: 5, right: 30, left: 20, bottom: 80 }} // Increased bottom margin
      >
        {/* Use number type and manually set domain for even distribution */}
        <XAxis
          type="number"
          dataKey="timestamp"
          domain={[minTimestamp, maxTimestamp]}
          tickFormatter={dateFormatter}
          scale="time" // Optional: ensures it uses time-based scaling
          tick={{ angle: -45, textAnchor: 'end' }} // Rotates the labels by 45 degrees
          height={60} // Adjust height to avoid cutting off labels
        />
        <YAxis dataKey="value" domain={['auto', 'auto']} />
        <Tooltip />
        <Legend verticalAlign="top" height={36} /> {/* Move legend to the top */}
        {Array.from(stockTimeline.keys()).map((key) => (
          <Line
            key={key}
            type="monotone"
            data={groupDataByHour(stockTimeline.get(key) as StockTimelineEntry[])}
            dataKey="value"
            stroke={stringToNumber(key)}
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

function stringToNumber(input: string): string {
  // Convert each character to its ASCII code and combine them into a number
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = input.charCodeAt(i) + ((hash << 5) - hash);
  }

  // Convert the hash to a 6-digit hexadecimal color code
  let color = '#';
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xFF;
    color += ('00' + value.toString(16)).slice(-2);
  }

  return color;
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