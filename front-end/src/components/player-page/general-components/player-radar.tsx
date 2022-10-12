import { Box, Theme, Typography, useTheme, SxProps } from '@mui/material';
import React from 'react';
import { PolarRadiusAxis, Radar, ResponsiveContainer, Tooltip } from 'recharts';
import { PolarAngleAxis, PolarGrid, RadarChart } from 'recharts';
import { PlayerDetailedGame, PlayerGamesResponse } from '../../../../../Common/Interface/Internal/player';
import { calculateKDA, NonNone, roundTo } from '../../../../../Common/utils';
import RisenBox1 from '../../risen-box/risen-box-1';


interface RadarOptions {
  height?: number,
  width?: number,
  size?: number,
  hideLabels?: boolean,
  noHover?: boolean,
}
interface Props
{
  sx?: SxProps<Theme> | undefined;
  games: PlayerDetailedGame[];
  options: RadarOptions;
}

function PlayerRadar({sx, games, options}: Props)
{
  const nGames = games ? games?.length : 0;
  const theme = useTheme() as Theme;
  const playerValues = {
    kills: 0,
    deaths: 0,
    assists: 0,
    vspm: 0,
    kp: 0,
    dpct: 0,
    dtpct: 0
  };
  for (const game of games) {
    playerValues.kills += game.playerGame.kills;
    playerValues.deaths += game.playerGame.deaths;
    playerValues.assists += game.playerGame.assists;
    playerValues.vspm += game.playerGame.visionScorePerMinute;
    playerValues.kp += game.playerGame.killParticipation;
    playerValues.dpct += game.playerGame.teamDamagePercentage;
    playerValues.dtpct += game.playerGame.damageTakenOnTeamPercentage;
  }

  let key: keyof typeof playerValues;
  for (key in playerValues) {
    playerValues[key] /= nGames;
  }
  const data = [
    {
      "subject": "KDA",
      "A": Math.min(calculateKDA(playerValues) / 5, 1),
      "trueValue": roundTo(calculateKDA(playerValues), 2),
      "fullMark": 5
    },
    {
      "subject": "VS",
      "A": Math.min(playerValues.vspm / 3, 1),
      "trueValue": roundTo(playerValues.vspm, 2),
      "fullMark": 3
    },
    {
      "subject": "KP%",
      "A": Math.min(playerValues.kp / .8, 1),
      "trueValue": roundTo(playerValues.kp*100, 0),
      "fullMark": .8
    },
    {
      "subject": "DD%",
      "A": Math.min(playerValues.dpct / .35, 1),
      "trueValue": roundTo(playerValues.dpct*100, 0),
      "fullMark": .3
    },
    {
      "subject": "DT%",
      "A": Math.min(playerValues.dtpct / .3, 1),
      "trueValue": roundTo(playerValues.dtpct*100, 0),
      "fullMark": .3
    }
  ];

  const whiteLabel = ({x, y, stroke, value}: {[key: string]: any}) => {
    <div style={{ color: '#FFFFFF' }}>
      <text x={x} y={y} dy={-4} fill={stroke} fontSize={10} textAnchor="middle">{value}1</text>);
    </div>
  }

  function customTick({ payload, x, y, textAnchor, stroke, radius }: {[key: string]: any}) {
    return (
      <g
        className="recharts-layer recharts-polar-angle-axis-tick"
      >
        {/* <div > */}
          <text
            radius={radius}
            stroke={stroke}
            x={x}
            y={y}
            className="recharts-text recharts-polar-angle-axis-tick-value"
            textAnchor={textAnchor}
            style={{ fill: 'white', fontSize: 20 }}
          >
            {payload.value}
          </text>

        {/* </div> */}
      </g>
    );
  }

  function customTooltip({ active, payload, label }: any) {
    if (active && payload && payload.length) {
      const payloadData = payload[0].payload;
      let text = `${payloadData.subject}: ${payloadData.trueValue}`;
      if (payloadData.subject.includes('%')) {
        text += '%';
      }
      return (
        <Box sx={{backgroundColor: theme.palette.info.dark, p: .8, borderRadius: 3}}>
          <Typography>{text}</Typography>
        </Box>
      )
    }
    return null;
  }

  return (
    // <ResponsiveContainer >
      <RadarChart outerRadius={NonNone(options.size, 90)} data={data} height={NonNone(options.height, 300)} width={NonNone(options.width, NonNone(options.height, 300))}>
        <PolarGrid />
        { options.hideLabels ? null : <PolarAngleAxis dataKey="subject" label={whiteLabel} tick={customTick} />}
        <PolarRadiusAxis angle={90} domain={[0, 1]} tick={false} />
        <Radar name="You" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
        {
          options.noHover ? null : <Tooltip content={customTooltip} />
        }
        {/* <Radar name="Lily" dataKey="B" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} /> */}
      </RadarChart>
    // </ResponsiveContainer>
  )
}

export default PlayerRadar;