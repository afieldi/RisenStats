import { useTheme } from '@emotion/react';
import { Box, Typography, Theme, SxProps } from '@mui/material';
import React from 'react';

enum ImagePositions {
  TopLeft,
  TopRight,
  BottomLeft,
  BottomRight,
}

interface ImgBoxProps {
  width?: string;
  height?: string;
  text?: string;
  src: string;
  alt?: string;
  border?: string;
  location?: ImagePositions; // defaults to bottom right
  sx?: SxProps<Theme> | undefined;
}

export default function ImgBox(props: ImgBoxProps) {
  const {
    src,
    alt,
    border,
    height,
    width,
    text,
    location,
    sx,
  } = props;

  const theme = useTheme() as Theme;

  const leftSide = location === ImagePositions.TopLeft || location === ImagePositions.BottomLeft;
  const topSide = location === ImagePositions.TopLeft || location === ImagePositions.TopRight;

  const textTheme: SxProps<Theme> = {
    display: 'flex',
    flexDirection: leftSide ? 'row' : 'row-reverse',
    position: 'relative',
    lineHeight: '1em',
    bottom: '1.4em',
  };

  const combinedSx: SxProps<Theme> = {
    height: height ?? 55,
    width: width ?? (height ?? 55),
    position: 'relative',
    ...sx
  };

  return (
    <Box sx={combinedSx} >
      <img alt={alt}
        src={src}
        height={height}
        width={width}/>
      <Box sx={textTheme}>
        <Typography sx={{ bgcolor: theme.palette.risenBoxBg.main, padding: '0 3px', lineHeight: '1.3' }} color={theme.palette.info.light} variant="button">
          {text}
        </Typography>
      </Box>
      {
        border && (
          <Box sx={{ width, height, position: 'absolute', border, top: 0, left: 0 }} />
        )
      }
    </Box>
  );
}