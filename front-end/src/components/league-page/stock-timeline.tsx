import { Theme, Typography, useTheme } from '@mui/material';
import { Box } from '@mui/system';
import React, { useEffect, useState } from 'react';
import { CartesianGrid, Label, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { StockTimelineEntry } from '../../../../Common/Interface/Internal/stocks';
import TeamModel from '../../../../Common/models/team.model';


interface StockTimeLineProps {
  stockTimeline: Map<number, StockTimelineEntry[]>
  teams: Map<number, TeamModel>
}

export default function StockTimeline(props: StockTimeLineProps): JSX.Element {
  const stockTimelineAbbreviated = mapTeamIdToAbbreviation(props.teams, props.stockTimeline);
  const stockTimeline = bridgeData(stockTimelineAbbreviated);

  const [shownLines, setShownLines] = useState<Set<string>>(new Set(stockTimeline.keys()));

  const timestamps = Array.from(stockTimeline.values()).flat().map(entry => entry.timestamp.getTime());
  const minTimestamp = Math.min(...timestamps);
  const maxTimestamp = Math.max(...timestamps);

  // Date formatter for tooltip and axis, including hours
  const dateFormatter = (dateTime: any) => {
    const date = new Date(dateTime);
    return date.toLocaleDateString('en-GB', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart margin={{ top: 5, right: 30, left: 20, bottom: 80 }}>
        <XAxis
          type="number"
          dataKey="timestamp"
          domain={[minTimestamp, maxTimestamp]}
          tickFormatter={dateFormatter}
          tick={{ angle: -45, textAnchor: 'end' }}
          height={60}
        />
        <YAxis dataKey="value" domain={['auto', 'auto']} />
        <Tooltip />
        <Legend verticalAlign="top" onClick={onClickLegend(setShownLines)} height={36} />

        {Array.from(stockTimeline.keys()).map((key) => (
          <Line
            key={key}
            hide={!shownLines.has(key)}
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

function onClickLegend(setShownLines: React.Dispatch<React.SetStateAction<Set<string>>>) {
  return function onClickLegend(...args: any[]): void {
    if (args[0].type !== 'line' || !args[0].value) return;

    const lineKey = args[0].value;
    setShownLines((prevShownLines) => {
      const updatedShownLines = new Set(prevShownLines);
      if (updatedShownLines.has(lineKey)) {
        updatedShownLines.delete(lineKey);
      } else {
        updatedShownLines.add(lineKey);
      }
      return updatedShownLines;
    });
  };
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
    const bridgedEntries = fillMissingTimestamps(entries, orderedUniqueTimestamps);
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