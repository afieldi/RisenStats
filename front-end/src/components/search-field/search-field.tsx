import React, { KeyboardEvent, ReactNode } from 'react';
import { alpha } from '@mui/system';
import { InputBase, Theme, SxProps } from '@mui/material';

import SearchIcon from '@mui/icons-material/Search';
import { styled } from '@mui/material/styles';
import { useTheme } from '@emotion/react';

export const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

export const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

export const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    // width: '100%',
    [theme.breakpoints.up('xs')]: {
      width: '10ch',
    },
    [theme.breakpoints.up('sm')]: {
      width: '100%',
    },
  },
}));

interface Props
{
  placeholder?: string;
  id?: string;
  onSubmit?: (event: KeyboardEvent<HTMLInputElement>) => void;
  sx?: SxProps<Theme> | undefined;
  endAdornment?: ReactNode;
}

export default function SearchField({ id, placeholder, onSubmit, sx, endAdornment }: Props)
{
  let resolvedPlaceholder: string = placeholder ? placeholder : 'Search...';
  const theme = useTheme() as Theme;
  return (
    <Search sx={sx} theme={theme}>
      <SearchIconWrapper>
        <SearchIcon />
      </SearchIconWrapper>
      <StyledInputBase
        id={id}
        placeholder={resolvedPlaceholder}
        inputProps={{ 'aria-label': 'search' }}
        onKeyPress={(ev: KeyboardEvent<HTMLInputElement>) => {
          if (ev.key === 'Enter') {
            if (onSubmit)
            {
              onSubmit(ev);
            }
            ev.preventDefault();
          }
        }}
        endAdornment={endAdornment}
      />
    </Search>
  );
}