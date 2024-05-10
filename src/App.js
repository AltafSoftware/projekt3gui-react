import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GamePage from './pages/GamePage';
import Registration from './pages/Registration';
import HomePage from './pages/HomePage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/registrering" element={<Registration />} />
        <Route path="/spilSide" element={<GamePage />} />
      </Routes>
    </Router>
  );
}

export default App;
