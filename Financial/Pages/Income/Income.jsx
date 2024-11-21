import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Income.css';

export default function Income() {
  const [amount, setAmount] = useState('');
  const [source, setSource] = useState('');
  const [incomes, setIncomes] = useState([]);
  const navigate = useNavigate();

  const handleAddIncome = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('userData'));
      if (!userData) {
        navigate('/login');
        return;
      }
  
      // Prepare the data to send
      const newIncome = { amount, source };
  
      // Log the data to be sent to the backend, including the email
      console.log('Sending data to backend:', {
        email: userData.email,
        ...newIncome
      });
  
      // Send the data to the backend
      const response = await axios.post('http://localhost:5000/api/auth/incomes', {
        email: userData.email,
        ...newIncome,
      });
  
      // Update state with the new income
      setIncomes(prevIncomes => [...prevIncomes, response.data.income]);
      setAmount('');
      setSource('');
    } catch (error) {
      console.error('Error adding income:', error);
      alert('Failed to add income. Please try again later.');
    }
  };

  // Calculate total income by summing the amount from each income entry
  const totalIncome = incomes.reduce((total, income) => total + parseFloat(income.amount), 0);

  return (
    <div className="income-container">
      <h1>Add Income</h1>
      <div className="form-group">
        <label>Amount:</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
        />
      </div>
      <div className="form-group">
        <label>Source:</label>
        <input
          type="text"
          value={source}
          onChange={(e) => setSource(e.target.value)}
          placeholder="Enter income source"
        />
      </div>
      <button onClick={handleAddIncome}>Add Income</button>

      <h2>Your Incomes</h2>
      <ul>
        {incomes.map((income, index) => (
          <li key={index}>
            <p>Amount: ${income.amount}</p>
            <p>Source: {income.source}</p>
            <p>Date: {new Date(income.date).toLocaleDateString()}</p>
          </li>
        ))}
      </ul>

      {/* Display total income at the end */}
      <h3>Total Income: ${totalIncome.toFixed(2)}</h3>
    </div>
  );
}