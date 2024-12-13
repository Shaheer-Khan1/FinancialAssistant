import React, { useState } from 'react';
import axios from 'axios';

export default function Debts() {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [type, setType] = useState('Taken');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    const userEmail = JSON.parse(localStorage.getItem('userData'))?.email; 

    if (!userEmail) {
      setMessage('User is not logged in.');
      return;
    }

    const data = {
      email: userEmail,
      description,
      amount: parseFloat(amount),
      date,
      type,
    };

    // Send data to the backend
    axios
      .post('http://localhost:5000/api/auth/debts', data)
      .then((response) => {
        setMessage('Debt added successfully!');
        setDescription('');
        setAmount('');
        setDate('');
        setType('Taken');
      })
      .catch((error) => {
        console.error('Error adding debt:', error);
        setMessage('Failed to add debt.');
      });
  };

  return (
    <div className="debt-form-container">
      <h1>Add Debt</h1>
      {message && <div>{message}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="description">Description:</label>
          <input
            type="text"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="amount">Amount:</label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="0"
            step="any"
            required
          />
        </div>
        <div>
          <label htmlFor="date">Date:</label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="type">Type:</label>
          <select
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="Taken">Taken</option>
            <option value="Lended">Lended</option>
          </select>
        </div>
        <button type="submit">Add Debt</button>
      </form>
    </div>
  );
}
