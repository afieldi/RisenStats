import React, { Dispatch, SetStateAction, useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Toolbar from '@mui/material/Toolbar';
import MenuIcon from '@mui/icons-material/Menu';
import IconButton from '@mui/material/IconButton';
import LoginIcon from '@mui/icons-material/Login';
import MuiAppBar from '@mui/material/AppBar';
import { styled } from '@mui/material/styles';
import { Search, SearchIconWrapper, StyledInputBase } from '../search-field/search-field';
import { Autocomplete, Box, InputAdornment, Theme, Typography, Hidden } from '@mui/material';
import { useTheme } from '@emotion/react';
import SearchIcon from '@mui/icons-material/Search';
import { DRAWER_WIDTH } from '../../common/constants';
import { SearchPlayers } from '../../api/player';

interface AppBarProps {
  barOpen?: boolean,
  theme?: any
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'barOpen',
})<AppBarProps>(({ theme, barOpen }: AppBarProps) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(barOpen && {
    marginLeft: DRAWER_WIDTH,
    width: `calc(100% - ${DRAWER_WIDTH}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

interface Props {
  open: boolean,
  setOpen: Dispatch<SetStateAction<boolean>>,
}

export default function HeaderBar({ open, setOpen }: Props) {
  const navigate = useNavigate();
  const theme = useTheme() as Theme;
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState<string[]>([]);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();
  const latestRequestId = useRef(0);
  const highlightedRef = useRef<string | null>(null);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const fetchSuggestions = (query: string) => {
    clearTimeout(debounceRef.current);
    if (query.length < 2) {
      setOptions([]);
      return;
    }
    const requestId = ++latestRequestId.current;
    debounceRef.current = setTimeout(async () => {
      const result = await SearchPlayers(query);
      if (requestId === latestRequestId.current) {
        setOptions(result.players.map(p => p.tag ? `${p.name}#${p.tag}` : p.name));
      }
    }, 300);
  };

  function doSearch(value?: string) {
    const playerName = (value ?? inputValue).replaceAll('#', '-');
    setOptions([]);
    setInputValue('');
    navigate(`player/${encodeURIComponent(playerName)}`);
  }

  return (
    <AppBar position="fixed" barOpen={open} sx={{ bgcolor: '#12121200' }}>
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={handleDrawerOpen}
          edge="start"
          sx={{
            marginRight: '36px',
            ...(open && { display: 'none' }),
          }}
        >
          <MenuIcon />
        </IconButton>
        <Hidden smDown>
          <Box sx={{ flexGrow: 1, display: 'flex', pr: 2 }}>
            <Link to="/">
              <Box sx={{ height: '50px', display: 'inline-flex', top: '10px' }} className="clickable-bg">
                <img src="/images/logos/risen-small-white.png" width="60" height="50"></img>
                <Hidden smDown>
                  <Typography variant="h5" sx={{ pt: 1.5, pl: 1 }}>Risen Esports</Typography>
                </Hidden>
              </Box>
            </Link>
          </Box>
        </Hidden>
        <Autocomplete
          freeSolo
          options={options}
          inputValue={inputValue}
          onHighlightChange={(_, option) => {
            highlightedRef.current = option as string | null;
          }}
          onInputChange={(_, value, reason) => {
            if (reason === 'input') {
              setInputValue(value);
              fetchSuggestions(value);
            }
          }}
          onChange={(_, value) => {
            if (value) doSearch(value as string);
          }}
          renderInput={(params) => (
            <Search ref={params.InputProps.ref} theme={theme}>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Summoner Name"
                inputProps={{
                  ...params.inputProps,
                  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => {
                    if (e.key === 'Enter') {
                      if (highlightedRef.current) {
                        // Option is highlighted — let Autocomplete select it, which fires onChange
                        (params.inputProps as any).onKeyDown?.(e);
                      } else {
                        doSearch(inputValue);
                      }
                    } else {
                      (params.inputProps as any).onKeyDown?.(e);
                    }
                  },
                }}
                endAdornment={
                  <InputAdornment position='end'>
                    <IconButton onClick={() => doSearch()} edge='start'>
                      <LoginIcon />
                    </IconButton>
                  </InputAdornment>
                }
              />
            </Search>
          )}
        />
      </Toolbar>
    </AppBar>
  );
}
