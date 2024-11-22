import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginRegister from '../Pages/LoginRegister/LoginRegister'; // Correct import path
import Dashboard from '../Pages/Dashboard/Dashboard';
import Income from '../Pages/Income/Income';
import './App.css'; // Import custom CSS
import CryptoDashboard from '../Pages/CryptoDashboard/CryptoDashboard';
import ZakatCalculator from '../Pages/ZakatCalc/ZakatCalculator';
import Expense from '../Pages/Expenses/Expenses';
import Budget from '../Pages/Budget/Budget';
import ScrollWheelNavbar from '../Components/Navbar';
import Savings from '../Pages/Savings/Savings';

const App = () => {
  return (
    <div>
      <ScrollWheelNavbar/>
    <Routes> 
          <Route path="/" element={<LoginRegister />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/income" element={<Income />} />
          <Route path="/crypto" element={<CryptoDashboard />} />
          <Route path="/zakat" element={<ZakatCalculator />} />
          <Route path="/expenses" element={<Expense/>}/>
          <Route path="/budget" element={<Budget/>}/>
          <Route path="/savings" element={<Savings/>}/>
    </Routes>  
    </div>
  );
};

export default App;
