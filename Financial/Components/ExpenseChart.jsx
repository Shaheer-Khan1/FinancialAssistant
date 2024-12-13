import React, { useEffect, useRef } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

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
  const chartContainerRef = useRef(null); 

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

            for (let i = 29; i >= 0; i--) {
              const date = new Date();
              date.setDate(currentDate.getDate() - i);
              last30Days.push(date.toISOString().split('T')[0]); 
              dailyTotals.push(0); 
            }

            expenses.forEach((expense) => {
              const expenseDate = new Date(expense.date).toISOString().split('T')[0];
              const dayIndex = last30Days.indexOf(expenseDate);
              if (dayIndex >= 0) {
                dailyTotals[dayIndex] += parseFloat(expense.amount);
              }
            });

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

            if (chartContainerRef.current) {
              new ChartJS(chartContainerRef.current, {
                type: 'line', 
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
        <canvas ref={chartContainerRef}></canvas>
      </div>
    </div>
  );
};

export default ExpenseCharts;
