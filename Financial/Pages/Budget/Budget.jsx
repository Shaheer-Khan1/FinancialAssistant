import React, { useState } from 'react';
import axios from 'axios';

export default function Budget() {
  const [amount, setAmount] = useState(0);
  const [duration, setDuration] = useState('1 month');
  const [email, setEmail] = useState('');

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Retrieve email from local storage
    const userData = JSON.parse(localStorage.getItem('userData'));
    const emailFromStorage = userData?.email;

    // Get the current date
    const currentDate = new Date().toISOString();

    if (emailFromStorage) {
      try {
        // Send POST request to the backend with the date included
        const response = await axios.post('http://localhost:5000/api/auth/budget', {
          email: emailFromStorage,
          budget: {
            amount,
            duration,
            date: currentDate, // Add the date to the request body
          },
        });
        console.log('Budget saved successfully', response.data);
      } catch (error) {
        console.error('Error saving budget:', error);
      }
    } else {
      console.error('Email not found in local storage');
    }
  };

  return (
    <div>
      <h1>Set Your Budget</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Amount:</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Duration:</label>
          <input
            type="text"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            required
          />
        </div>
        <button type="submit">Save Budget</button>
      </form>
    </div>
  );
}
