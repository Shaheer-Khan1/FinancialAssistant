import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../Expenses/Expenses.css';

export default function Expense() {
  const [expense, setExpense] = useState({ date: '', amount: '', description: '' });
  const [expenses, setExpenses] = useState([]); // State to hold the list of expenses
  const [error, setError] = useState('');
  const [editingExpense, setEditingExpense] = useState(null); // New state to track the expense being edited

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
      if (editingExpense) {
        // If editing an existing expense, update it
        await axios.put('http://localhost:5000/api/auth/expenses', {
          email,
          // Send old values along with new values
          oldDate: editingExpense.date, // Pass old values for updating
          oldAmount: editingExpense.amount,
          oldDescription: editingExpense.description,
          newDate: expense.date, // Send new updated values
          newAmount: expense.amount,
          newDescription: expense.description,
        });
        alert('Expense updated successfully!');
      } else {
        // If adding a new expense
        await axios.post('http://localhost:5000/api/auth/expenses', { ...expense, email });
        alert('Expense added successfully!');
      }

      setExpense({ date: '', amount: '', description: '' });
      setEditingExpense(null); // Reset the editing state
      fetchExpenses(); // Refresh the expense list after adding/updating
    } catch (err) {
      alert(err.response?.data?.message || 'Error adding/updating expense.');
    }
  };

  const handleDelete = async (date, amount, description) => {
    const userData = JSON.parse(localStorage.getItem('userData'));
    const email = userData?.email;

    if (!email) {
      alert('User email not found. Please log in again.');
      return;
    }

    try {
      await axios.delete('http://localhost:5000/api/auth/expenses', {
        data: { email, date, amount, description },
      });
      alert('Expense deleted successfully!');
      fetchExpenses(); // Refresh the expense list after deletion
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting expense.');
    }
  };

  const handleUpdate = (expenseToEdit) => {
    setExpense({
      date: expenseToEdit.date,
      amount: expenseToEdit.amount,
      description: expenseToEdit.description,
    });
    setEditingExpense(expenseToEdit); // Set the expense you're editing
  };

  useEffect(() => {
    fetchExpenses(); // Fetch expenses when the component mounts
  }, []);

  return (
    <div className="expense-container">
      <form onSubmit={handleSubmit}>
        <h2>{editingExpense ? 'Update Expense' : 'Add Expense'}</h2>
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
        <button type="submit">{editingExpense ? 'Update Expense' : 'Add Expense'}</button>
      </form>

      <div className="expense-list">
        <h2>Your Expenses</h2>
        {error && <p className="error-message">{error}</p>}
        {expenses.length === 0 ? (
          <p>No expenses found.</p>
        ) : (
          <ul>
            {expenses.map((exp, index) => (
              <li key={index}>
                <strong>Date:</strong> <span>{exp.date}</span>
                <strong>Amount:</strong> <span>${exp.amount}</span>
                <strong>Description:</strong> <span>{exp.description}</span>
                <button onClick={() => handleUpdate(exp)}>
                  Update
                </button>
                <button onClick={() => handleDelete(exp.date, exp.amount, exp.description)}>
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
