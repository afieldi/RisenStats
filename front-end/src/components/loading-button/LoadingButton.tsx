import { Button, SxProps, Theme } from '@mui/material';
import React from 'react';

interface Props
{
  sx?: SxProps<Theme> | undefined;
  children?: React.ReactNode;
  onClick?: () => void;
  loading?: boolean;
  variant?: 'contained' | 'outlined' | 'text';
  color?: 'primary' | 'secondary' | 'inherit' | 'error' | 'warning' | 'info' | 'success';
}

export default function LoadingButton({ sx, children, onClick, loading, variant, color }: Props)
{
  return (
    <Button
      onClick={onClick}
      disabled={loading}
      variant={variant}
      color={color}
      sx={{
        ...sx,
        cursor: loading ? 'not-allowed' : 'pointer',
        opacity: loading ? 0.5 : 1,
      }}
    >
      {children}
    </Button>
  );
}
