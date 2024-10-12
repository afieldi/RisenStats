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
      flexDirection: reverse? 'row-reverse' : 'row',
      columnGap: '10px',
      height: '125px',
    }}>
      {
        champions.map(champion => (
          <Box sx={{
            display: 'flex',
            backgroundImage: `url(/images/champions/profile/${champion}_0.jpg)`,
            backgroundSize: 'cover',
            width: '100px',
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