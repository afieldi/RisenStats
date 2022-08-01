import { useTheme } from '@emotion/react';
import { Box, Typography, Theme } from '@mui/material';
import React from 'react';

export interface Props {
  children?: React.ReactNode;
  sx?: {};
}

export default function RisenBox1(props: Props) {
  const { children, sx, ...other } = props;
  const theme = useTheme() as Theme;
  // if (!sx)
  let sxFinal = {...{
    p: 2,
    bgcolor: theme.palette.risenBoxBg.main,
    borderRadius: 2
  }, ...sx};
  return (
    <Box sx={sxFinal}>
      {children}
    </Box>
  );
}