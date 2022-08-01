import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import logo from './logo.svg';
import './App.css';
import './styles/globals.css';
import darkTheme from './styles/theme/darkTheme';

import Player from './pages/player/player';

function App() {
  return (
    <Router>
      <ThemeProvider theme={darkTheme}>
        <div className="App">
          <Routes>
            <Route path="/player/:playerName" element={<Player />}></Route>
          </Routes>
        </div>
      </ThemeProvider>
    </Router>

  );
}

export default App;
