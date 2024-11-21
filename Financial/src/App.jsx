import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginRegister from '../Pages/LoginRegister/LoginRegister'; // Correct import path
import Dashboard from '../Pages/Dashboard/Dashboard';
import Income from '../Pages/Income/Income';
import './App.css'; // Import custom CSS

const App = () => {
  return (
    <div>
    <Routes> 
          <Route path="/" element={<LoginRegister />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/income" element={<Income />} />
    </Routes>  
    </div>
  );
};

export default App;
