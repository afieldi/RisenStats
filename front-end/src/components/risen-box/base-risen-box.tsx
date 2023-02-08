import { useTheme } from '@emotion/react';
import { Box, Typography, Theme, SxProps } from '@mui/material';
import React from 'react';

export interface Props {
  children?: React.ReactNode;
  sx?: SxProps<Theme> | undefined;
  title?: React.ReactNode | string;
  hideDivider?: boolean;
}

export default function BaseRisenBox(props: Props) {
  const { children, sx, ...other } = props;
  const theme = useTheme() as Theme;

  let sxFinal: SxProps<Theme> = {...{
    p: 2,
    bgcolor: theme.palette.risenBoxBg.main,
    borderRadius: 1,
    flexWrap: 'wrap'
  }, ...sx};

  let titleDisplay: React.ReactNode | null = null;
  if (props.title) {
    if (typeof props.title === 'string') {
      titleDisplay = (
        <Box>
          <Typography fontFamily="Montserrat" fontStyle="italic" variant='h5' align='left' color={theme.palette.info.main}>{props.title.toUpperCase()}</Typography>
        </Box>
      );
    }
    else {
      titleDisplay = props.title;
    }
  }
  return (
    <Box sx={sxFinal}>
      {
        titleDisplay
      }
      {
        props.hideDivider ? null :
        <hr color={theme.palette.info.main}></hr>
      }
      {children}
    </Box>
  );
}