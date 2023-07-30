import { SxProps, Theme, Box } from '@mui/material';
import React, { ReactNode } from 'react';
import { roundTo } from '../../../../Common/utils';

interface RisenBannerProps {
  children?: ReactNode;
  sx?: SxProps<Theme>;
}

export default function RisenBanner(props: RisenBannerProps) {
  const {
    children,
    sx,
  } = props;

  // @ts-ignore
  const width = sx?.width ?? 500;

  // @ts-ignore
  const color: string = sx?.backgroundColor ?? 'color';

  return (
    <Box width={width}>
      <Box sx={sx}>
        {children}
      </Box>
      <Box sx={{ display: 'flex' }}>
        <Box sx={{
          borderTop: `${roundTo(width / 2, 0)}px solid ${color}`,
          borderRight: `${roundTo(width / 2, 0)}px solid transparent`,
          width: 0,
          height: 0
        }} />
        <Box sx={{
          borderTop: `${roundTo(width / 2, 0)}px solid ${color}`,
          borderLeft: `${roundTo(width / 2, 0)}px solid transparent`,
          width: 0,
          height: 0
        }} />
      </Box>
    </Box>
  );
}