import { BrowserRouter as Router,Routes, Route, Link } from 'react-router-dom';

import logo from './logo.svg';
import './App.css';

import Player from './pages/player/player.tsx';
// import PlayerPageHeader from './components/player-page/header';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
        <Routes>
          <Route path="/player/:playerName" element={Player}></Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
