import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function BudgetRemaining() {
  const [remainingBudget, setRemainingBudget] = useState(null);
  const [totalExpenses, setTotalExpenses] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRemainingBudget = async () => {
      // Retrieve email from localStorage
      const userData = JSON.parse(localStorage.getItem('userData'));
      const emailFromStorage = userData?.email;

      if (emailFromStorage) {
        try {
          const response = await axios.get('http://localhost:5000/api/auth/budget-remaining', {
            params: { email: emailFromStorage },
          });
          setRemainingBudget(response.data.remainingBudget);
          setTotalExpenses(response.data.totalExpenses);
        } catch (error) {
          setError('Error fetching remaining budget.');
        }
      } else {
        setError('Email not found in local storage');
      }
    };

    fetchRemainingBudget();
  }, []);

  return (
    <div>
      <h3>Remaining Budget</h3>
      {error ? (
        <p>{error}</p>
      ) : (
        <div>
          <p>Total Expenses: ${totalExpenses}</p>
          <p>Remaining Budget: ${remainingBudget}</p>
        </div>
      )}
    </div>
  );
}
