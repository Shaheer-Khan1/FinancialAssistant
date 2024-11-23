import React, { useEffect, useRef } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Register necessary chart components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const ExpenseCharts = () => {
  const chartContainerRef = useRef(null); // Use ref to avoid unnecessary state updates

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData) {
      axios
        .get('http://localhost:5000/api/auth/expenses', { params: { email: userData.email } })
        .then((response) => {
          if (response.data && response.data.expenses) {
            const expenses = response.data.expenses;
            const currentDate = new Date();
            const last30Days = [];
            const dailyTotals = [];

            // Generate the last 30 days
            for (let i = 29; i >= 0; i--) {
              const date = new Date();
              date.setDate(currentDate.getDate() - i);
              last30Days.push(date.toISOString().split('T')[0]); // Push date in 'YYYY-MM-DD' format
              dailyTotals.push(0); // Initialize the total for each day
            }

            // Calculate the daily total for expenses
            expenses.forEach((expense) => {
              const expenseDate = new Date(expense.date).toISOString().split('T')[0];
              const dayIndex = last30Days.indexOf(expenseDate);
              if (dayIndex >= 0) {
                dailyTotals[dayIndex] += parseFloat(expense.amount);
              }
            });

            // Prepare chart data
            const chartData = {
              labels: last30Days,
              datasets: [
                {
                  label: 'Expenses ($)',
                  data: dailyTotals,
                  fill: false,
                  borderColor: 'rgba(75, 192, 192, 1)',
                  tension: 0.1,
                },
              ],
            };

            // Render the chart using Chart.js directly
            if (chartContainerRef.current) {
              new ChartJS(chartContainerRef.current, {
                type: 'line', // Render line chart
                data: chartData,
                options: {
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                    },
                  },
                },
              });
            }
          }
        })
        .catch((error) => {
          console.error('Error fetching expense data:', error);
        });
    }
  }, []);

  return (
    <div className="expense-charts-container">
      <h3>Expense Data (Last 30 Days)</h3>
      <div>
        {/* Chart will be rendered directly into this container */}
        <canvas ref={chartContainerRef}></canvas>
      </div>
    </div>
  );
};

export default ExpenseCharts;
