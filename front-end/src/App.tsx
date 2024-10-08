import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import './App.css';
import './styles/globals.css';
import RoutedApp from './RoutedApp';

function App() {
  return (
    <Router>
      <Analytics />
      <RoutedApp />
    </Router>
  );
}

export default App;
