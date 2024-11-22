import React, {  useState } from 'react';
import { Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { StockTimelineEntry } from '../../../../Common/Interface/Internal/stocks';
import TeamModel from '../../../../Common/models/team.model';
import StockTimelineChartTooltip from './stock-timeline-chart-tooltip';


interface StockTimeLineProps {
  stockTimeline: Map<number, StockTimelineEntry[]>
  teams: Map<number, TeamModel>
}

export default function StockTimelineChart(props: StockTimeLineProps): JSX.Element {
  const stockTimelineAbbreviated = mapTeamIdToAbbreviation(props.teams, props.stockTimeline);
  const stockTimeline = bridgeData(stockTimelineAbbreviated);

  stockTimeline.forEach((entries, symbol) => {
    const updatedEntries = entries.map((entry, index) => ({
      ...entry,
      index: index // Replace timestamp with index for even spacing
    }));
    stockTimeline.set(symbol, updatedEntries);
  });


  const [shownLines, setShownLines] = useState<Set<string>>(new Set(stockTimeline.keys()));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart margin={{ top: 5, right: 30, bottom: 80 }}>
        <XAxis
          type="number"
          dataKey="index"
          hide={true}
        />
        <YAxis dataKey="value" domain={['auto', 'auto']} />
        <Tooltip content={<StockTimelineChartTooltip active={true} payload={[]} label={''} />} />
        <Legend verticalAlign="top" height={50} onClick={onClickLegend(setShownLines)} />

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
            dot={true}
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
  // Convert the input string to a hash
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = input.charCodeAt(i) + ((hash << 5) - hash);
  }

  // Use the hash to generate a hue value (0-360) in the HSL color space
  const hue = Math.abs(hash % 12) * 30;
  // Set saturation to 70% and lightness to 50% for good contrast with white text
  const saturation = 70;
  const lightness = 50;

  // Convert HSL to RGB and then to hexadecimal color code
  return hslToHex(hue, saturation, lightness);
}

// Helper function to convert HSL to Hex
function hslToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = l - c / 2;

  let r = 0, g = 0, b = 0;

  if (0 <= h && h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (60 <= h && h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (120 <= h && h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (180 <= h && h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (240 <= h && h < 300) {
    r = x;
    g = 0;
    b = c;
  } else if (300 <= h && h < 360) {
    r = c;
    g = 0;
    b = x;
  }

  // Convert RGB to hexadecimal format
  const toHex = (n: number) => Math.round((n + m) * 255).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
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