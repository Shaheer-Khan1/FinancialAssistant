import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function HighestBudget() {
  const [highestBudgets, setHighestBudgets] = useState([]);

  useEffect(() => {
    // Fetch the highest budgets for each duration
    const fetchHighestBudgets = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/auth/highest-budget');
        setHighestBudgets(response.data);  // Set the data to state
      } catch (error) {
        console.error('Error fetching highest budgets:', error);
      }
    };

    fetchHighestBudgets();
  }, []);

  return (
    <div>
      <h3>Budget</h3>
      <ul>
        {highestBudgets.map((budget, index) => (
          <li key={index}>
            <strong>{budget.duration}</strong>: ${budget.highestBudget}
          </li>
        ))}
      </ul>
    </div>
  );
}
