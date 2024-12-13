import React, { useEffect, useRef } from 'react';
import axios from 'axios';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import './IncomeCharts.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const SavingCharts = () => {
  const chartContainerRef = useRef(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData && userData.email) {
      axios
        .get(`http://localhost:5000/api/auth/savings/${userData.email}`)  
        .then((response) => {
          if (response.data && response.data.savings) {
            const savings = response.data.savings;
            const currentDate = new Date();
            const months = [];
            const savingAmounts = [];

            for (let i = 5; i >= 0; i--) {
              const monthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
              months.push(monthDate.toLocaleString('default', { month: 'short', year: 'numeric' }));
              savingAmounts.push(0); 
            }

            savings.forEach((saving) => {
              const savingDate = new Date(saving.date);
              const monthIndex = currentDate.getMonth() - savingDate.getMonth();
              if (monthIndex >= 0 && monthIndex <= 5) {
                savingAmounts[5 - monthIndex] += saving.amount; 
              }
            });

            const chartData = {
              labels: months,
              datasets: [
                {
                  label: 'Savings ($)',
                  data: savingAmounts,
                  backgroundColor: 'rgba(0, 255, 0, 0.2)', 
                  borderColor: 'rgba(0, 255, 0, 1)', 
                  borderWidth: 2,  
                },
              ],
            };

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
                          weight: 'bold', 
                          size: 12, 
                          color: 'white', 
                        },
                      },
                      grid: {
                        color: 'white', 
                        lineWidth: 1, 
                      },
                    },
                    x: {
                      ticks: {
                        font: {
                          weight: 'bold',
                          size: 12, 
                          color: 'white',
                        },
                      },
                      grid: {
                        color: 'white', 
                        lineWidth: 1,
                      },
                    },
                  },
                  plugins: {
                    legend: {
                      labels: {
                        font: {
                          weight: 'bold', 
                          color: 'white', 
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
        <canvas ref={chartContainerRef}></canvas>
      </div>
    </div>
  );
};

export default SavingCharts;
