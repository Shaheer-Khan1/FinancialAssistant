import React, { useEffect, useRef } from 'react';
import axios from 'axios';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import './IncomeCharts.css';

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

            for (let i = 5; i >= 0; i--) {
              const monthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
              months.push(monthDate.toLocaleString('default', { month: 'short', year: 'numeric' }));
              incomeAmounts.push(0); 
            }

            incomes.forEach((income) => {
              const incomeDate = new Date(income.date);
              const monthIndex = currentDate.getMonth() - incomeDate.getMonth();
              if (monthIndex >= 0 && monthIndex <= 5) {
                incomeAmounts[5 - monthIndex] += income.amount;
              }
            });

            const chartData = {
              labels: months,
              datasets: [
                {
                  label: 'Income ($)',
                  data: incomeAmounts,
                  backgroundColor: 'rgba(255, 0, 0, 0.2)',  
                  borderColor: 'rgba(255, 0, 0, 1)',  
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
          console.error('Error fetching income data:', error);
        });
    }
  }, []);

  return (
    <div className="income-charts-container">
      <h3 style={{ color: 'white' }}>Income Data (Last 6 Months)</h3>
      <div>
        <canvas ref={chartContainerRef}></canvas>
      </div>
    </div>
  );
};

export default IncomeCharts;
