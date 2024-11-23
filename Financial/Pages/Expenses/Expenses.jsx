import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Expense() {
  const [expense, setExpense] = useState({ date: '', amount: '', description: '' });
  const [expenses, setExpenses] = useState([]); // State to hold the list of expenses
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setExpense((prev) => ({ ...prev, [name]: value }));
  };

  const fetchExpenses = async () => {
    const userData = JSON.parse(localStorage.getItem('userData'));
    const email = userData?.email;

    if (!email) {
      setError('User email not found. Please log in again.');
      return;
    }

    try {
      const response = await axios.get('http://localhost:5000/api/auth/expenses', {
        params: { email },
      });
      setExpenses(response.data.expenses);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching expenses.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userData = JSON.parse(localStorage.getItem('userData'));
    const email = userData?.email;

    if (!email) {
      alert('User email not found. Please log in again.');
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/auth/expenses', { ...expense, email });
      alert('Expense added successfully!');
      setExpense({ date: '', amount: '', description: '' });
      fetchExpenses(); // Refresh the expense list after adding
    } catch (err) {
      alert(err.response?.data?.message || 'Error adding expense.');
    }
  };

  useEffect(() => {
    fetchExpenses(); // Fetch expenses when the component mounts
  }, []);

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h2>Add Expense</h2>
        <input
          type="date"
          name="date"
          value={expense.date}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="amount"
          value={expense.amount}
          onChange={handleChange}
          placeholder="Amount"
          required
        />
        <input
          type="text"
          name="description"
          value={expense.description}
          onChange={handleChange}
          placeholder="Description"
          required
        />
        <button type="submit">Add Expense</button>
      </form>

      <div>
        <h2>Your Expenses</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {expenses.length === 0 ? (
          <p>No expenses found.</p>
        ) : (
          <ul>
            {expenses.map((exp, index) => (
              <li key={index}>
                <strong>Date:</strong> {exp.date} | <strong>Amount:</strong> ${exp.amount} |{' '}
                <strong>Description:</strong> {exp.description}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
