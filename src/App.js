import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import HomePage from './components/HomePage';
import TypeDefenderGame from './components/TypeDefenderGame';
import VariableMasterGame from './components/VariableMasterGame';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/type-defender" element={<TypeDefenderGame />} />
          <Route path="/variable-master" element={<VariableMasterGame />} />
          <Route path="/game" element={<TypeDefenderGame />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
