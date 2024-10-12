import { Box, Typography } from '@mui/material';
import React from 'react';

interface Props {
  champions: string[];
  reverse?: boolean;
}

export default function({ champions, reverse }: Props) {
  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      rowGap: '10px',
      width: '300px',
      minWidth: '300px',
    }}>
      {
        champions.map(champion => (
          <Box sx={{
            display: 'flex',
            backgroundImage: champion ? `url(/images/champions/splash/${champion}_0.jpg)` : null,
            backgroundColor: 'blue',
            backgroundSize: 'cover',
            height: '125px',
            padding: '0 10px',
          }}>
            <Box sx={{
              display: 'flex',
              flexDirection: reverse ? 'row-reverse' : 'row',
              marginTop: 'auto',
              width: '100%'
            }}>
              <Typography>{champion}</Typography>
            </Box>
          </Box>
        ))
      }
    </Box>
  );
}