import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import './App.css';
import './styles/globals.css';
import RoutedApp from './RoutedApp';

function App() {
  return (
    <Router>
      <RoutedApp />
    </Router>
  );
}

export default App;
