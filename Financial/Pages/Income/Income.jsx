import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Income.css';

export default function Income() {
  const [amount, setAmount] = useState('');
  const [source, setSource] = useState('');
  const [incomes, setIncomes] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [currentIncome, setCurrentIncome] = useState(null); // For holding the income to be edited
  const navigate = useNavigate();

  useEffect(() => {
    const fetchIncomes = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem('userData'));
        if (!userData) {
          navigate('/login');
          return;
        }

        const response = await axios.get('http://localhost:5000/api/auth/incomes', {
          params: { email: userData.email },
        });

        setIncomes(response.data.incomes || []);
      } catch (error) {
        console.error('Error fetching incomes:', error);
        alert('Failed to load incomes. Please try again later.');
      }
    };

    fetchIncomes();
  }, [navigate]);

  const handleAddIncome = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('userData'));
      if (!userData) {
        navigate('/login');
        return;
      }

      const newIncome = { amount, source };

      if (editMode && currentIncome) {
        // Update income if in edit mode
        await axios.put('http://localhost:5000/api/auth/incomes', {
          email: userData.email,
          amount,
          source,
          oldAmount: currentIncome.amount,
          oldSource: currentIncome.source,
          oldDate: currentIncome.date,
        });

        setIncomes((prevIncomes) =>
          prevIncomes.map((income) =>
            income.amount === currentIncome.amount &&
            income.source === currentIncome.source &&
            income.date === currentIncome.date
              ? { ...income, amount, source }
              : income
          )
        );
      } else {
        // Add income if not in edit mode
        const response = await axios.post('http://localhost:5000/api/auth/incomes', {
          email: userData.email,
          amount,
          source,
        });

        setIncomes((prevIncomes) => [...prevIncomes, response.data.income]);
      }

      setAmount('');
      setSource('');
      setEditMode(false);
      setCurrentIncome(null);
    } catch (error) {
      console.error('Error adding/updating income:', error);
      alert('Failed to add or update income. Please try again later.');
    }
  };

  const handleDeleteIncome = async (income) => {
    try {
      const userData = JSON.parse(localStorage.getItem('userData'));
      if (!userData) {
        navigate('/login');
        return;
      }

      await axios.delete('http://localhost:5000/api/auth/incomes', {
        data: {
          email: userData.email,
          amount: income.amount,
          source: income.source,
          date: income.date,
        },
      });

      setIncomes(incomes.filter((inc) => inc.amount !== income.amount || inc.source !== income.source || inc.date !== income.date));
    } catch (error) {
      console.error('Error deleting income:', error);
      alert('Failed to delete income. Please try again later.');
    }
  };

  const handleEditIncome = (income) => {
    setEditMode(true);
    setCurrentIncome(income);
    setAmount(income.amount);
    setSource(income.source);
  };

  return (
    <div className="income-container">
      <h1>{editMode ? 'Edit Income' : 'Add Income'}</h1>
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
      <button onClick={handleAddIncome}>{editMode ? 'Update Income' : 'Add Income'}</button>

      <h2>Your Incomes</h2>
      <ul>
        {incomes.map((income, index) => (
          <li key={index}>
            <p>Amount: ${income.amount}</p>
            <p>Source: {income.source}</p>
            <p>Date: {new Date(income.date).toLocaleDateString()}</p>
            <button onClick={() => handleEditIncome(income)}>Edit</button>
            <button onClick={() => handleDeleteIncome(income)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
