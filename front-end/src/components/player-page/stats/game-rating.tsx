import { useTheme } from '@emotion/react';
import { Box, Divider, Theme, Tooltip, Typography } from '@mui/material';
import BaseRisenBox from '../../risen-box/base-risen-box';
import React from 'react';
import { Rank } from '../../../common/types';
import { getRankColor } from '../../../common/utils';

interface GameRatingProps {
    hasData: boolean;
    title: string,
    tooltip: String,
    rating: string,
    rank: Rank;
}

export default function GameRating(props: GameRatingProps) {
  const theme = useTheme() as Theme;

  return (
    <Box sx={{ maxWidth: 270, display: 'flex', flexDirection: 'column', rowGap: 2 }}>
      <BaseRisenBox
        sx={{ minWidth: 230 }}
        title={
          <Tooltip title={props.tooltip}>
            <Typography fontFamily="Montserrat" color={theme.palette.info.light} fontStyle="italic" align="left" variant="subtitle2">{props.title.toUpperCase()}</Typography>
          </Tooltip>
        }>

        { !props.hasData &&
                    <Typography sx={{ paddingTop: '10px' }} color={theme.palette.info.light} align="center" variant="h6">No Data</Typography>
        }
        { props.hasData &&
                    <Box sx={{ display: 'flex', flexDirection: 'row', columnGap: 1, justifyContent: 'space-between', alignContent: 'center' }}>
                      <Typography color={theme.palette.info.light} align="left" variant="h6">{props.rating}</Typography>
                      <Typography color={getRankColor(props.rank, theme)} align="left" variant="h5">{props.rank}</Typography>
                    </Box>
        }
      </BaseRisenBox>
    </Box>
  );
}
