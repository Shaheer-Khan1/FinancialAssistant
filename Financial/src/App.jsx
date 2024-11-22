import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginRegister from '../Pages/LoginRegister/LoginRegister'; // Correct import path
import Dashboard from '../Pages/Dashboard/Dashboard';
import Income from '../Pages/Income/Income';
import './App.css'; // Import custom CSS
import CryptoDashboard from '../Pages/CryptoDashboard/CryptoDashboard';
import ZakatCalculator from '../Pages/ZakatCalc/ZakatCalculator';

const App = () => {
  return (
    <div>
    <Routes> 
          <Route path="/" element={<LoginRegister />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/income" element={<Income />} />
          <Route path="/crypto" element={<CryptoDashboard />} />
          <Route path="/zakat" element={<ZakatCalculator />} />
    </Routes>  
    </div>
  );
};

export default App;
