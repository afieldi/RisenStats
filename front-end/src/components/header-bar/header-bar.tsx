import React, { Dispatch, KeyboardEvent, SetStateAction } from 'react';
import { useParams, useNavigate, Link } from "react-router-dom";
import Toolbar from '@mui/material/Toolbar';
import MenuIcon from '@mui/icons-material/Menu';
import IconButton from '@mui/material/IconButton';
import LoginIcon from '@mui/icons-material/Login';
import MuiAppBar from '@mui/material/AppBar';
import { styled } from '@mui/material/styles';
import SearchField from '../search-field/search-field';
import { Box, Typography, Hidden, InputAdornment } from '@mui/material';
import SignIn from '../signin/sign-in';
import { DRAWER_WIDTH } from "../../common/constants";

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

export default function HeaderBar({open, setOpen}: Props) {
  const navigate = useNavigate();
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const headerSearchId = 'playerHeaderId';

  function doSearch()
  {
    const playerName = (document.getElementById(headerSearchId) as HTMLInputElement).value;
    navigate(`player/${encodeURIComponent(playerName)}`)
  }

  return (
    <AppBar position="fixed" barOpen={open} sx={{bgcolor: '#12121200'}}>
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
          <Box sx={{flexGrow: 1, display: 'flex', pr: 2}}>
            <Link to="/">
              <Box sx={{height: '50px', display: 'inline-flex', top: '10px'}} className="clickable-bg">
                <img src="/images/logos/risen-small-white.png" width="60" height="50"></img>
                <Hidden smDown>
                  <Typography variant="h5" sx={{pt: 1.5, pl: 1}}>Risen Esports</Typography>
                </Hidden>
              </Box>
            </Link>
          </Box>
        </Hidden>
        {/* <SignIn></SignIn> */}
        <SearchField
          id={headerSearchId}
          placeholder="Summoner Name"
          onSubmit={doSearch}
          endAdornment={
            <InputAdornment position='end'>
              <IconButton
                onClick={doSearch}
                edge='start' >
                  <LoginIcon />
              </IconButton>
            </InputAdornment>
          }
        ></SearchField>
      </Toolbar>
    </AppBar>
  )
}