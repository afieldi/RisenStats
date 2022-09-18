import { useTheme } from '@emotion/react';
import { Box, Typography, Theme } from '@mui/material';
import React from 'react';

export interface Props {
  children?: React.ReactNode;
  sx?: {};
  title?: string;
}

export default function RisenBox1(props: Props) {
  const { children, sx, ...other } = props;
  const theme = useTheme() as Theme;
  // if (!sx)
  let sxFinal = {...{
    p: 2,
    bgcolor: theme.palette.risenBoxBg.main,
    borderRadius: 1,
    flexWrap: 'wrap'
  }, ...sx};
  return (
    <Box sx={sxFinal}>
      {
        props.title ?
        <Box>
          <Typography fontFamily="Montserrat" fontStyle="italic" variant='h5' align='left' color={theme.palette.info.main}>{props.title}</Typography>
          <hr color={theme.palette.info.main}></hr>
        </Box> : null
      }
      {children}
    </Box>
  );
}