import React, { useEffect, useState } from 'react';
import { Routes, Route, useSearchParams } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import './App.css';
import './styles/globals.css';
import Cookies from 'universal-cookie';
import { AUTH_COOKIE_KEY } from './common/constants';
import {
  AuthenticationContext,
  AuthenticationInterface,
  DEFAULT_USER, isAdmin
} from './components/authentication/authentication';
import AdminCodes from './pages/admin/codes';
import darkTheme from './styles/theme/darkTheme';

import Player from './pages/player/player';
import HeaderBar from './components/header-bar/header-bar';
import { SideBar } from './components/sidebar/sidebar';
import Home from './pages/home/home';
import Error404 from './pages/errors/404';
import StatExport from './pages/statExport/statExport';
import Leaderboards from './pages/leaderboards/leaderboards';
import SearchPage from './pages/search/search';
import LeaguePage from './pages/risenLeague/league';
import TeamPage from './pages/risenTeam/team';
import StatGraphic from './pages/stat-graphic/stat-graphic';
import FindLeague from './pages/risenLeague/findLeague';

function RoutedApp() {
  const [open, setOpen] = React.useState(false);
  const handleDrawerClose = () => {
    setOpen(false);
  };

  const [user, setUser] = useState<AuthenticationInterface>(DEFAULT_USER);
  const [params, setSearchParams] = useSearchParams();

  useEffect(() => {
    let code = params.get('code');
    const cookies = new Cookies();
    if (code) {
      cookies.set(AUTH_COOKIE_KEY, code);
      setSearchParams({});
    }
    else {
      code = cookies.get(AUTH_COOKIE_KEY);
    }
    if (code) {
      // verify user
      fetch(`${process.env.REACT_APP_BACKEND_URL}/api/auth/verify?auth=${code}`, { method: 'POST' }).then(response => {
        if (response.ok) {
          response.json().then(data => setUser(data));
        }
      });
    }
  }, []);

  return (
    <ThemeProvider theme={darkTheme}>
      <AuthenticationContext.Provider value={user}>
        <div className="App" style={{ paddingLeft: '65px' }}>
          <HeaderBar open={open} setOpen={setOpen}></HeaderBar>
          <SideBar open={open} onClose={handleDrawerClose}></SideBar>
          <Routes>
            <Route path="/" element={<Home/>}></Route>
            <Route path="/search" element={<SearchPage/>}></Route>
            <Route path="/player/:playerNameWithTagline" element={<Player/>}></Route>
            <Route path="/leagues" element={<FindLeague/>}></Route>
            <Route path="/leagues/:leagueName" element={<LeaguePage/>}></Route>
            <Route path="/leaderboard" element={<Leaderboards/>}></Route>
            <Route path="/leagues/:leagueName/:teamAbbr" element={<TeamPage/>}></Route>
            <Route path="*" element={<Error404/>}></Route>
            <Route path="/statexport" element={<StatExport/>}></Route>
            <Route path="/statgraphic" element={<StatGraphic/>}></Route>
            <Route path='/admin/codes' element={<AdminCodes/>} />
          </Routes>
        </div>
      </AuthenticationContext.Provider>
    </ThemeProvider>
  );
}

export default RoutedApp;
