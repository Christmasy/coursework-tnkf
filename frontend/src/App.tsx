import React from 'react';
import './App.css';
import RegistrationWindow from './pages/registration-window/registration-window';
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Routes>
      <Route
        path={'/registration'}
        element={<RegistrationWindow />}
      />
    </Routes>
  );
}

export default App;
