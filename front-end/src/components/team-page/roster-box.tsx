import { useTheme } from '@emotion/react';
import { Theme, Typography } from '@mui/material';
import React from 'react';
import { Box } from '@mui/system';
import PlayerModel from '../../../../Common/models/player.model';
import BaseRisenBox from '../risen-box/base-risen-box';
import { getGradient } from '../league-page/general';

export interface RosterProps {
    player: PlayerModel[]
}

export default function RosterBox(props: RosterProps) {
  const theme = useTheme() as Theme;

  return (
    <BaseRisenBox sx={{ minWidth: 280, minHeight: 280, flexGrow: 1,  background: getGradient(theme.palette.risenBoxBg.main) }} title="Roster">
      <Box>TODO</Box>
    </BaseRisenBox>
  );
}