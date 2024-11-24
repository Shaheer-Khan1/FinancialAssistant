import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Savings() {
  const [savingsAmount, setSavingsAmount] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [savingsList, setSavingsList] = useState([]); // Initialize as empty array
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const email = JSON.parse(localStorage.getItem('userData'))?.email;

  useEffect(() => {
    if (!email) {
      setError('No email found. Please log in first.');
      return;
    }

    const fetchSavings = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/auth/savings/${email}`);
        setSavingsList(response.data.savings || []); // Default to empty array
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch savings. Please try again.');
      }
    };

    fetchSavings();
  }, [email]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setError('No email found. Please log in first.');
      return;
    }

    const savingsData = {
      email,
      amount: Number(savingsAmount),
      description,
      date,
    };

    try {
      const response = await axios.post('http://localhost:5000/api/auth/savings', savingsData);
      setSuccessMessage('Savings successfully recorded!');
      setSavingsAmount('');
      setDescription('');
      setDate('');
      setError('');

      const updatedSavings = await axios.get(`http://localhost:5000/api/auth/savings/${email}`);
      setSavingsList(updatedSavings.data.savings || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save savings. Please try again.');
      setSuccessMessage('');
    }
  };

  return (
    <div>
      <h1>Enter Savings Details</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Savings Amount</label>
          <input
            type="number"
            value={savingsAmount}
            onChange={(e) => setSavingsAmount(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Description</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <button type="submit">Submit Savings</button>
      </form>

      {error && <div className="error-message" style={{ color: 'red' }}>{error}</div>}
      {successMessage && <div className="success-message" style={{ color: 'green' }}>{successMessage}</div>}

      <h2>Your Savings</h2>
      <ul>
        {Array.isArray(savingsList) && savingsList.map((saving, index) => (
          <li key={index}>
            <strong>Amount:</strong> {saving.amount} | <strong>Description:</strong> {saving.description} |{' '}
            <strong>Date:</strong> {new Date(saving.date).toLocaleDateString()}
          </li>
        ))}
      </ul>
    </div>
  );
}
