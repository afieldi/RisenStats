import { Box, Theme, Typography, useTheme } from '@mui/material';
import React from 'react';
import { getGradient } from '../../common/utils';

interface WardingHabitsProps {

}

export default function WardingHabits(props: WardingHabitsProps) {
  const theme = useTheme() as Theme;

  return (
    <>
      <Box sx={{ minWidth:'270px', p: 0.2, borderRadius: '5px 5px 0px 0px', background: getGradient(theme.palette.risenBoxBg.main)  }}>
        <Typography sx={{ pl: 1 }} fontFamily="Montserrat" variant='subtitle1' align='left' color={theme.palette.info.main}>Warding Habits</Typography>
        <hr/>
          Coming Soon
      </Box>
    </>
  );
}