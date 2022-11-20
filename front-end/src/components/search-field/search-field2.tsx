import React, { KeyboardEvent } from 'react';
import { alpha } from '@mui/system';
import { InputBase, Theme, SxProps, TextField } from '@mui/material';

import SearchIcon from '@mui/icons-material/Search';
import { styled } from '@mui/material/styles';
import { useTheme } from '@emotion/react';

const Search = styled('div')(({ theme }) => ({
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

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
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
  name?: string;
  id?: string;
  onSubmit?: (event: KeyboardEvent<HTMLInputElement>) => void;
  sx?: SxProps<Theme> | undefined;
}

export default function SearchField2({id, placeholder, onSubmit, sx, name}: Props)
{
  let resolvedPlaceholder: string = placeholder ? placeholder : "Search...";
  const theme = useTheme() as Theme;
  return (
    <TextField id={id}
      label={resolvedPlaceholder}
      variant="outlined"
      name={name}
      sx={sx}
      onKeyDown={(ev: KeyboardEvent<HTMLInputElement>) => {
        if (ev.key === 'Enter') {
          if (onSubmit)
          {
            onSubmit(ev);
          }
          ev.preventDefault();
        }
      }}
      />

    // <Search sx={sx} theme={theme}>
    //   <SearchIconWrapper>
    //     <SearchIcon />
    //   </SearchIconWrapper>
    //   <StyledInputBase
    //     placeholder={resolvedPlaceholder}
    //     inputProps={{ 'aria-label': 'search' }}
    //     onKeyPress={(ev) => {
    //       if (ev.key === 'Enter') {
    //         if (onSubmit)
    //         {
    //           onSubmit(ev);
    //         }
    //         ev.preventDefault();
    //       }
    //     }}
    //   />
    // </Search>
  )
}