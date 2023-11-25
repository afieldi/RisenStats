import { useTheme } from '@emotion/react';
import { Box, Typography, Theme, SxProps } from '@mui/material';
import React from 'react';

export interface Props {
  children?: React.ReactNode;
  sx?: SxProps<Theme> | undefined;
  title?: React.ReactNode | string;
  titleColor?: string;
  subtitle?: React.ReactNode | string;
  subtitleColor?: string;
  hideDivider?: boolean;
}

export default function BaseRisenBox(props: Props) {
  const { children, sx, titleColor, subtitleColor, ...other } = props;
  const theme = useTheme() as Theme;

  let sxFinal: SxProps<Theme> = { ...{
    p: 2,
    bgcolor: theme.palette.risenBoxBg.main,
    borderRadius: 1,
    flexWrap: 'wrap'
  }, ...sx };

  let titleDisplay: React.ReactNode | null = null;
  let subtitleDisplay: React.ReactNode | null = null;
  if (props.title) {
    if (typeof props.title === 'string') {
      titleDisplay = (
        <Box>
          <Typography fontFamily="Montserrat" fontStyle="italic" variant='h5' align='left' color={titleColor ?? theme.palette.info.main}>{props.title.toUpperCase()}</Typography>
        </Box>
      );
    }
    else {
      titleDisplay = props.title;
    }
  }

  if (props.subtitle) {
    if (typeof props.subtitle === 'string') {
      subtitleDisplay = (
        <Box>
          <Typography fontFamily="Montserrat" fontStyle="italic" variant='subtitle1' align='left' color={subtitleColor ?? theme.palette.info.main}>{props.subtitle.toUpperCase()}</Typography>
        </Box>
      );
    }
    else {
      subtitleDisplay = props.subtitle;
    }
  }
  return (
    <Box sx={sxFinal}>
      {
        titleDisplay
      }
      {
        subtitleDisplay
      }
      {
        props.hideDivider ? null :
          <hr color={theme.palette.info.main}></hr>
      }
      {children}
    </Box>
  );
}