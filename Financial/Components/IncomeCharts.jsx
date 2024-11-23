import React, { useEffect, useRef } from 'react';
import axios from 'axios';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import './IncomeCharts.css';

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
                  backgroundColor: 'rgba(255, 0, 0, 0.2)',  // Red bar color
                  borderColor: 'rgba(255, 0, 0, 1)',  // Red border for bars
                  borderWidth: 2,  // Bold border
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
                      ticks: {
                        font: {
                          weight: 'bold', // Make Y-axis labels bold
                          size: 12, // Adjust font size
                          color: 'white', // Make Y-axis labels white
                        },
                      },
                      grid: {
                        color: 'white', // Set grid lines to white
                        lineWidth: 1, // Set grid line thickness
                      },
                    },
                    x: {
                      ticks: {
                        font: {
                          weight: 'bold', // Make X-axis labels bold
                          size: 12, // Adjust font size
                          color: 'white', // Make X-axis labels white
                        },
                      },
                      grid: {
                        color: 'white', // Set grid lines to white
                        lineWidth: 1, // Set grid line thickness
                      },
                    },
                  },
                  plugins: {
                    legend: {
                      labels: {
                        font: {
                          weight: 'bold', // Make legend text bold
                          color: 'white', // Make legend labels white
                        },
                      },
                    },
                  },
                  elements: {
                    bar: {
                      borderWidth: 2,
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
      <h3 style={{ color: 'white' }}>Income Data (Last 6 Months)</h3>
      <div>
        {/* Chart will be rendered directly into this container */}
        <canvas ref={chartContainerRef}></canvas>
      </div>
    </div>
  );
};

export default IncomeCharts;
