import { Box, Theme, Typography, useTheme } from '@mui/material';
import React from 'react';
import BaseRisenBox from '../risen-box/base-risen-box';
import { getGradient } from './general';
import PlayerGameModel from '../../../../Common/models/playergame.model';
import { abbreviateNumber } from '../../common/utils';
import { PING_SRC } from '../../common/constants';


interface LeagueDragonsProps {
  games: PlayerGameModel[]
}

export default function LeaguePings(props: LeagueDragonsProps) {
  const theme = useTheme() as Theme;

  let pings = buildLeagueTotalPings(props.games);
  return (
    <BaseRisenBox sx={{ minWidth: 240, maxWidth: 270, justifyContent:'space-between', background: getGradient(theme.palette.risenBoxBg.main) }} title="Total Pings">
      <Box sx={{ justifyContent:'space-between', display: 'flex', flexWrap: 'wrap', columnGap: 2, rowGap: 1, padding: '4px' }}>
        {
          pings
            .sort((a, b) => b.count - a.count)
            .map((ping, index) => {
              return getPing(theme, ping.src, ping.count, `${index}`);
            })
        }
      </Box>
    </BaseRisenBox>
  );
}

function buildLeagueTotalPings(games: PlayerGameModel[]) {
  let allIn = { count: 0, src: PING_SRC.ALL_IN };
  let assist = { count: 0, src: PING_SRC.ASSIST };
  let ping = { count: 0, src: PING_SRC.PING };
  let bait = { count: 0, src: PING_SRC.BAIT };
  let mia = { count: 0, src: PING_SRC.MIA };
  let areaIsWarded = { count: 0, src: PING_SRC.AREA_IS_WARDED };
  let hold = { count: 0, src: PING_SRC.HOLD };
  let needWard ={ count: 0, src: PING_SRC.NEED_WARD };
  let onMyWay ={ count: 0, src: PING_SRC.ON_MY_WAY };
  let push = { count: 0, src: PING_SRC.PUSH };
  let cleared = { count: 0, src: PING_SRC.CLEARED };
  let command = { count: 0, src: PING_SRC.COMMAND };
  let danger = { count: 0, src: PING_SRC.DANGER };
  for (let game of games) {
    allIn.count += game.allInPings;
    assist.count += game.assistMePings;
    ping.count += game.basicPings;
    bait.count += game.baitPings;
    mia.count += game.enemyMissingPings;
    areaIsWarded.count += game.enemyVisionPings;
    hold.count += game.holdPings;
    needWard.count += game.needVisionPings;
    onMyWay.count += game.onMyWayPings;
    push.count += game.pushPings;
    cleared.count += game.visionClearedPings;
    command.count += game.commandPings;
    danger.count += game.dangerPings;
  }
  return [
    allIn, assist,ping, bait, mia, areaIsWarded, hold, needWard, onMyWay, push, cleared, command, danger
  ];
    
}

function getPing(theme: Theme, src: string, value: number, name: string) {
  return (
    <Box key={name}>
      <img alt={name} src={src} height="25x" width="25px"/>
      <Box sx={{ width: '30px' }}>
        <Typography  fontFamily="Montserrat"
          align="center"
          variant="button">{abbreviateNumber(value)}</Typography>
      </Box>
    </Box>
  );
}