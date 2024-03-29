import { useTheme } from '@emotion/react';
import { SxProps, Theme, Typography } from '@mui/material';
import { Box } from '@mui/material';
import React from 'react';
import PlayerModel from '../../../../../Common/models/player.model';
import BaseRisenBox from '../../risen-box/base-risen-box';

interface Props {
  player?: PlayerModel;
  sx?: SxProps<Theme> | undefined;
}

export default function RankFlag({ player, sx }: Props)
{
  const theme = useTheme() as Theme;
  let league = player?.league ? player?.league : 'Unranked';
  league = league[0].toUpperCase() + league.substring(1).toLocaleLowerCase();
  return (
    <BaseRisenBox title="Rank" sx={sx}>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        {
          league === 'Unranked' ? null :
            <Box sx={{ height: 160, pr: 2, pl: 2 }}>
              <img src={`/images/ranks/Emblem_${league}.png`} style={{ height: '100%' }}></img>
            </Box>
        }
        <Box sx={{ flexGrow: 1, textAlign: 'left', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <Typography variant="subtitle1" align="center" sx={{ fontFamily: 'Montserrat' }}>{league} {player?.division}</Typography>
        </Box>
      </Box>
    </BaseRisenBox>
  );
}