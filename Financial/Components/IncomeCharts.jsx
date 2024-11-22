import React, { useEffect, useRef } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const IncomeCharts = () => {
  const chartContainerRef = useRef(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData) {
      axios
        .get('http://localhost:5000/api/auth/incomes', {
          params: { email: userData.email },
        })
        .then((response) => {
          if (response.data && response.data.incomes) {
            const incomes = response.data.incomes;
            const currentDate = new Date();
            const months = [];
            const incomeAmounts = [];

            // Prepare the data for the last 6 months
            for (let i = 5; i >= 0; i--) {
              const monthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
              months.push(monthDate.toLocaleString('default', { month: 'short', year: 'numeric' }));
              incomeAmounts.push(0); // Initialize income amount for each month
            }

            // Sum the income for each of the last 6 months
            incomes.forEach((income) => {
              const incomeDate = new Date(income.date);
              const monthIndex = currentDate.getMonth() - incomeDate.getMonth();
              if (monthIndex >= 0 && monthIndex <= 5) {
                incomeAmounts[5 - monthIndex] += income.amount; // Accumulate income for the corresponding month
              }
            });

            // Prepare chart data directly
            const chartData = {
              labels: months,
              datasets: [
                {
                  label: 'Income ($)',
                  data: incomeAmounts,
                  backgroundColor: 'rgba(75, 192, 192, 0.2)',
                  borderColor: 'rgba(75, 192, 192, 1)',
                  borderWidth: 1,
                },
              ],
            };

            // Render the chart (avoid state to prevent re-renders)
            if (chartContainerRef.current) {
              new ChartJS(chartContainerRef.current, {
                type: 'bar',
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
          console.error('Error fetching income data:', error);
        });
    }
  }, []);

  return (
    <div className="income-charts-container">
      <h1>Income Data (Last 6 Months)</h1>
      <div>
        {/* Chart will be rendered directly into this container */}
        <canvas ref={chartContainerRef}></canvas>
      </div>
    </div>
  );
};

export default IncomeCharts;
