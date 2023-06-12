import { Box, Typography, SxProps, Theme } from '@mui/material';
import React from 'react';
import { PlayerDetailedGame } from '../../../../../Common/Interface/Internal/player';
import BaseRisenBox from '../../risen-box/base-risen-box';
import PlayerRadar from './player-radar';

interface Props {
  sx?: SxProps<Theme> | undefined;
  games: PlayerDetailedGame[];
}

export default function PlayerRadarCard({ sx, games }: Props) {
  const options = {
    height: 300,
    width: 300
  };
  return (
    <BaseRisenBox sx={sx} title="Performance">
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <PlayerRadar games={games} sx={sx} options={options}></PlayerRadar>
      </Box>
    </BaseRisenBox>
  );
}