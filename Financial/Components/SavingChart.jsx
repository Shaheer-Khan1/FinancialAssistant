import React, { useEffect, useRef } from 'react';
import axios from 'axios';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import './IncomeCharts.css';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const SavingCharts = () => {
  const chartContainerRef = useRef(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData && userData.email) {
      axios
        .get(`http://localhost:5000/api/auth/savings/${userData.email}`)  // Adjusted to use the email parameter in URL
        .then((response) => {
          if (response.data && response.data.savings) {
            const savings = response.data.savings;
            const currentDate = new Date();
            const months = [];
            const savingAmounts = [];

            // Prepare the data for the last 6 months
            for (let i = 5; i >= 0; i--) {
              const monthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
              months.push(monthDate.toLocaleString('default', { month: 'short', year: 'numeric' }));
              savingAmounts.push(0); // Initialize saving amount for each month
            }

            // Sum the savings for each of the last 6 months
            savings.forEach((saving) => {
              const savingDate = new Date(saving.date);
              const monthIndex = currentDate.getMonth() - savingDate.getMonth();
              if (monthIndex >= 0 && monthIndex <= 5) {
                savingAmounts[5 - monthIndex] += saving.amount; // Accumulate savings for the corresponding month
              }
            });

            // Prepare chart data directly
            const chartData = {
              labels: months,
              datasets: [
                {
                  label: 'Savings ($)',
                  data: savingAmounts,
                  backgroundColor: 'rgba(0, 255, 0, 0.2)',  // Green bar color for savings
                  borderColor: 'rgba(0, 255, 0, 1)',  // Green border for bars
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
          console.error('Error fetching savings data:', error);
        });
    }
  }, []);

  return (
    <div className="income-charts-container">
      <h3 style={{ color: 'white' }}>Savings Data (Last 6 Months)</h3>
      <div>
        {/* Chart will be rendered directly into this container */}
        <canvas ref={chartContainerRef}></canvas>
      </div>
    </div>
  );
};

export default SavingCharts;
