import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginRegister from '../Pages/LoginRegister/LoginRegister'; 
import Dashboard from '../Pages/Dashboard/Dashboard';
import Income from '../Pages/Income/Income';
import './App.css'; 
import CryptoDashboard from '../Pages/CryptoDashboard/CryptoDashboard';
import ZakatCalculator from '../Pages/ZakatCalc/ZakatCalculator';
import Expense from '../Pages/Expenses/Expenses';
import Budget from '../Pages/Budget/Budget';
import Navbar from '../Components/Navbar';
import Savings from '../Pages/Savings/Savings';
import Debts from '../Pages/Debts/Debts';

const App = () => {
  return (
    <div>
      
    <Routes> 
          <Route path="/" element={<LoginRegister />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/income" element={<Income />} />
          <Route path="/crypto" element={<CryptoDashboard />} />
          <Route path="/zakat" element={<ZakatCalculator />} />
          <Route path="/expenses" element={<Expense/>}/>
          <Route path="/budget" element={<Budget/>}/>
          <Route path="/savings" element={<Savings/>}/>
          <Route path="/debts" element={<Debts/>}/>
    </Routes>  
    </div>
  );
};

export default App;
