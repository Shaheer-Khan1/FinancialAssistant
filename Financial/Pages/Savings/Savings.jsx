import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Savings.css';

export default function Savings() {
  const [savingsAmount, setSavingsAmount] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [savingsList, setSavingsList] = useState([]); 
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false); 
  const [editingSaving, setEditingSaving] = useState(null); 

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
      if (isEditing && editingSaving) {
        const updatedSavingData = {
          email,
          oldAmount: editingSaving.amount,
          oldDescription: editingSaving.description, 
          oldDate: editingSaving.date, 
          amount: Number(savingsAmount),
          description,
          date,
        };

        await axios.put('http://localhost:5000/api/auth/savings', updatedSavingData);
        setSuccessMessage('Savings updated successfully!');
      } else {
        const response = await axios.post('http://localhost:5000/api/auth/savings', savingsData);
        setSuccessMessage('Savings successfully recorded!');
      }

      setSavingsAmount('');
      setDescription('');
      setDate('');
      setError('');
      setIsEditing(false);
      setEditingSaving(null);

      const updatedSavings = await axios.get(`http://localhost:5000/api/auth/savings/${email}`);
      setSavingsList(updatedSavings.data.savings || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save savings. Please try again.');
      setSuccessMessage('');
    }
  };

  const handleUpdate = (saving) => {
    setSavingsAmount(saving.amount);
    setDescription(saving.description);
    setDate(saving.date);
    setIsEditing(true);
    setEditingSaving(saving); 
  };

  const handleDelete = async (saving) => {
    const deleteData = {
      email,
      amount: saving.amount,
      description: saving.description,
    };

    try {
      await axios.delete('http://localhost:5000/api/auth/savings', { data: deleteData });
      setSuccessMessage('Savings deleted successfully!');
      
      const updatedSavings = await axios.get(`http://localhost:5000/api/auth/savings/${email}`);
      setSavingsList(updatedSavings.data.savings || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete savings. Please try again.');
      setSuccessMessage('');
    }
  };

  return (
    <div className="savings-container">
      <h1>{isEditing ? 'Update Savings Details' : 'Enter Savings Details'}</h1>
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

        <button type="submit">{isEditing ? 'Update Savings' : 'Submit Savings'}</button>
      </form>

      {error && <div className="error-message">{error}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}

      <h2>Your Savings</h2>
      <div className="savings-list">
        <ul>
          {Array.isArray(savingsList) && savingsList.map((saving, index) => (
            <li key={index}>
              <strong>Amount:</strong> {saving.amount}
              <strong>Description:</strong> {saving.description}
              <strong>Date:</strong> {new Date(saving.date).toLocaleDateString()}
              <button onClick={() => handleUpdate(saving)}>Update</button>
              <button onClick={() => handleDelete(saving)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
