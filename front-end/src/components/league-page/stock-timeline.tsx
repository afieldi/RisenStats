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
  const stockTimelineAbbrevated = mapTeamIdToAbbreviation(props.teams, props.stockTimeline);

  const stockTimeline = bridgeData(stockTimelineAbbrevated);

  console.log(stockTimeline);
  // Find the minimum and maximum timestamps from the dataset to set the X-axis domain
  const timestamps = Array.from(stockTimeline.values()).flat().map(entry => entry.timestamp.getTime());
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
        margin={{ top: 5, right: 30, left: 20, bottom: 80 }}
      >
        {/* Use number type and manually set domain for even distribution */}
        <XAxis
          type="number"
          dataKey="timestamp"
          domain={[minTimestamp, maxTimestamp]}
          tickFormatter={dateFormatter}
          scale="time"
          tick={{ angle: -45, textAnchor: 'end' }}
          height={60}
        />
        <YAxis dataKey="value" domain={['auto', 'auto']} />
        <Tooltip />
        <Legend verticalAlign="top" height={36} />
        {Array.from(stockTimeline.keys()).map((key) => (
          <Line
            key={key}
            type="monotone"
            data={stockTimeline.get(key)}
            dataKey="value"
            name={key}
            stroke={mapStringToColorCode(key)}
            connectNulls={false}
            isAnimationActive={true}
            dot={false}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}

function mapStringToColorCode(input: string): string {
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

function roundToHour(date: Date): Date {
  const newDate = new Date(date);
  newDate.setMinutes(0, 0, 0); // Set minutes, seconds, and milliseconds to 0
  newDate.setMinutes(0,0,0);
  // newDate.setHours(0,0,0);
  return newDate;
}

function bridgeData(stockTimeline: Map<string, StockTimelineEntry[]>): Map<string, StockTimelineEntry[]> {

  const bridgedTimelineMap = new Map<string, StockTimelineEntry[]>();

  // group the stocks by hour so that we dont have random extra ticks
  const groupedStockTimeline = groupStocksByHour(stockTimeline);

  const orderedUniqueTimestamps = getOrderedUniqueTimestamps(groupedStockTimeline);

  groupedStockTimeline.forEach((entries, symbol) => {
    const bridgedEntries = fillMissingTimestampsOptimized(entries, orderedUniqueTimestamps);
    bridgedTimelineMap.set(symbol, bridgedEntries);
  });

  return bridgedTimelineMap;
}

function groupStocksByHour(stockTimeline: Map<string, StockTimelineEntry[]>): Map<string, StockTimelineEntry[]> {
  const groupedTimeline = new Map<string, StockTimelineEntry[]>();

  stockTimeline.forEach((entries, symbol) => {
    const groupedEntries = entries.map(entry => ({
      ...entry,
      timestamp: roundToHour(entry.timestamp)
    }));
    groupedTimeline.set(symbol, groupedEntries);
  });

  return groupedTimeline;
}

function getOrderedUniqueTimestamps(groupedStockTimeline: Map<string, StockTimelineEntry[]>): number[] {
  const uniqueTimestamps = new Set<number>();

  groupedStockTimeline.forEach((entries) => {
    entries.forEach((entry) => {
      uniqueTimestamps.add(entry.timestamp.getTime());
    });
  });

  return Array.from(uniqueTimestamps).sort((a, b) => a - b);
}

function fillMissingTimestamps(stockTimelineForTickerEntries: StockTimelineEntry[], orderedUniqueTimestamps: number[]): StockTimelineEntry[] {
  const filledEntries: StockTimelineEntry[] = [];
  const usedTimestamps = new Set<number>();
  let lastValue = stockTimelineForTickerEntries[0]?.value || 0;

  stockTimelineForTickerEntries.forEach((entry, index) => {
    usedTimestamps.add(entry.timestamp.getTime());
    filledEntries.push(entry);

    orderedUniqueTimestamps.forEach((timestamp) => {
      if (usedTimestamps.has(timestamp)) {
        return;
      }

      const orderedDate = new Date(timestamp);

      // TODO handle the case where all the values in orderedUniqueTimestamps are before all the values in stockTimelineForTickerEntries

      // If we're at the end, fill with the last known value
      if (index + 1 >= stockTimelineForTickerEntries.length) {
        usedTimestamps.add(orderedDate.getTime());
        filledEntries.push({ timestamp: orderedDate, value: lastValue });
        return;
      }

      // If the time is after the current date the we dont want to add it cause there might be a better value to use
      if (orderedDate.getTime() >= entry.timestamp.getTime()) {
        lastValue = entry.value;
      }

      // if the time is before the current date then its between two points so we fill the data
      else if (orderedDate.getTime() < entry.timestamp.getTime()) {
        usedTimestamps.add(orderedDate.getTime());
        filledEntries.push({ timestamp: orderedDate, value: lastValue });
      }
    });
  });

  return filledEntries;
}

function fillMissingTimestampsOptimized(stockTimelineForTickerEntries: StockTimelineEntry[], orderedUniqueTimestamps: number[]): StockTimelineEntry[] {
  const filledEntries: StockTimelineEntry[] = [];
  let stockValues = new Map<number, number>();
  let current: number = stockTimelineForTickerEntries[0]?.value || 0;

  for (let stockTimelineForTickerEntry of stockTimelineForTickerEntries) {
    stockValues.set(new Date(stockTimelineForTickerEntry.timestamp).getTime(), stockTimelineForTickerEntry.value);
  }

  for (let orderedUniqueTimestamp of orderedUniqueTimestamps) {
    if(stockValues.has(orderedUniqueTimestamp)) {
      current = stockValues.get(orderedUniqueTimestamp) as number;
    }

    filledEntries.push({
      timestamp: new Date(orderedUniqueTimestamp),
      value: current,
    });
  }

  return filledEntries;
}