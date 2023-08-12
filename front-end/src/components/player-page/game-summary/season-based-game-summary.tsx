import GameModel from '../../../../../Common/models/game.model';
import { riotTimestampToGameTime, timeToTimeAgo } from '../../../../../Common/utils';
import { useTheme } from '@emotion/react';
import { Box, Theme, Typography } from '@mui/material';
import AllTeamInfo from './all-team-info';
import React from 'react';
import { getGradient } from '../../league-page/general';

interface SeasonBasedGameSummaryProps {
    blueTeamAbbreviation: string,
    redTeamAbbreviation: string,
    match: GameModel,
}

export function SeasonBasedGameSummary(props: SeasonBasedGameSummaryProps)
{
  const theme = useTheme() as Theme;

  const blueWin = props.match.winner;
  const bgColor = blueWin ? theme.palette.risenVictory.light : theme.palette.risenDefeat.light;
  const timestamp = new Date();

  timestamp.setUTCMilliseconds(+props.match.gameStart + (+props.match.gameDuration * 1000));

  return (
    <Box sx={{ p: 1, borderRadius: '4px', background: getGradient(bgColor) }}>
      <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
        <Typography sx={{ pb: 0.3 }} fontFamily="Montserrat" variant='subtitle2' align='left'>{props.blueTeamAbbreviation} VS {props.redTeamAbbreviation}</Typography>
      </Box>
      <Box sx={{ display: 'inline-flex', flexDirection: 'row', width: '100%', flexWrap: 'wrap', justifyContent: 'space-evenly', alignItems: 'center', columnGap: 0.8 }}>
        <Box sx={{ width: 90, flexWrap: 'wrap' }}>
          <Typography fontFamily="Montserrat" variant='subtitle2' align='left'>{riotTimestampToGameTime(props.match.gameDuration)}</Typography>
          <hr/>
          <Typography variant='body2' align='left'>{timeToTimeAgo(+props.match.gameStart + +props.match.gameDuration)}</Typography>
        </Box>
        <AllTeamInfo gameModel={props.match} sx={{ width: '150px' }} />
      </Box>
    </Box>
  );
}
