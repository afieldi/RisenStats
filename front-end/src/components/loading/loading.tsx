import React from 'react';
import { CircularProgress, SxProps, Theme, Box } from '@mui/material';

interface LoadingProps {
  sx?: SxProps<Theme> | undefined;
};

export default function Loading({ sx }: LoadingProps) {
  return (
    <Box sx={sx}>
      <CircularProgress />
    </Box>
  );
}