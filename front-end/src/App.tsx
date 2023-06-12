import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import './App.css';
import './styles/globals.css';
import darkTheme from './styles/theme/darkTheme';

import Player from './pages/player/player';
import HeaderBar from './components/header-bar/header-bar';
import { SideBar } from './components/sidebar/sidebar';
import Home from './pages/home/home';
import Error404 from './pages/errors/404';
import StatExport from './pages/statExport/statExport';
import Leaderboards from './pages/leaderboards/leaderboards';
import SearchPage from './pages/search/search';
import Rosters from './pages/rosters/rosters';

function App() {
  const [open, setOpen] = React.useState(false);
  const handleDrawerClose = () => {
    setOpen(false);
  };
  return (
    <Router>
      <ThemeProvider theme={darkTheme}>
        <div className="App" style={{ paddingLeft: '65px' }}>
          <HeaderBar open={open} setOpen={setOpen}></HeaderBar>
          <SideBar open={open} onClose={handleDrawerClose}></SideBar>
          <Routes>
            <Route path="/" element={<Home />}></Route>
            <Route path="/search" element={<SearchPage />}></Route>
            <Route path="/player/:playerName" element={<Player />}></Route>
            <Route path="/404" element={<Error404 />}></Route>
            <Route path="/statexport" element={<StatExport />}></Route>
            <Route path="/leaderboard" element={<Leaderboards />}></Route>
            <Route path="/rosters" element={<Rosters />}></Route>
          </Routes>
        </div>
      </ThemeProvider>
    </Router>

  );
}

export default App;
