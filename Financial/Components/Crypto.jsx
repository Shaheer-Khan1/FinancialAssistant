import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Register chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

export default function Crypto() {
  const [userHoldings, setUserHoldings] = useState([]);
  const [error, setError] = useState('');
  const [coinPrices, setCoinPrices] = useState({});
  const chartRef = useRef(null);

  // Fetch the user's crypto holdings
  useEffect(() => {
    const email = JSON.parse(localStorage.getItem('userData'))?.email;
    if (!email) {
      setError('No email found in local storage');
      return;
    }

    // Fetch the user's holdings using the email
    axios
      .post('http://localhost:5000/api/auth/crypto/holdings', { email })
      .then((response) => {
        setUserHoldings(response.data.holdings);
      })
      .catch((error) => {
        setError('Failed to load user holdings');
        console.error('Error fetching holdings:', error);
      });
  }, []);

  // Fetch real-time prices for the coins using CoinGecko API
  useEffect(() => {
    if (userHoldings.length > 0) {
      const coinIds = userHoldings.map((holding) => holding.coinName.toLowerCase()).join(',');

      axios
        .get(`https://api.coingecko.com/api/v3/simple/price?ids=${coinIds}&vs_currencies=usd`)
        .then((response) => {
          setCoinPrices(response.data);
        })
        .catch((error) => {
          setError('Failed to load coin prices');
          console.error('Error fetching coin prices:', error);
        });
    }
  }, [userHoldings]);

  // Create the pie chart with the total value of the coins
  useEffect(() => {
    if (userHoldings.length > 0 && Object.keys(coinPrices).length > 0 && chartRef.current) {
      const chartData = {
        labels: [],
        datasets: [
          {
            label: 'Crypto Holdings Value',
            data: [],
            backgroundColor: [
              'rgba(255, 99, 132, 0.6)',
              'rgba(54, 162, 235, 0.6)',
              'rgba(255, 206, 86, 0.6)',
              'rgba(75, 192, 192, 0.6)',
              'rgba(153, 102, 255, 0.6)',
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
            ],
            borderWidth: 1,
          },
        ],
      };

      userHoldings.forEach((holding) => {
        const coinName = holding.coinName.toLowerCase();
        const coinPrice = coinPrices[coinName];
        if (coinPrice) {
          const totalValue = holding.amount * coinPrice.usd;
          chartData.labels.push(`${holding.coinName} - $${totalValue.toFixed(2)}`);
          chartData.datasets[0].data.push(totalValue);
        }
      });

      const ctx = chartRef.current.getContext('2d');
      if (ctx.chart) {
        ctx.chart.destroy(); // Destroy the existing chart if present
      }

      // Create a new Pie chart
      new ChartJS(ctx, {
        type: 'pie',
        data: chartData,
      });
    }
  }, [userHoldings, coinPrices]);

  return (
    <div>
      <h3>Crypto Portfolio</h3>

      {/* Error message if any */}
      {error && <div style={{ color: 'red' }}>{error}</div>}

      {/* User Holdings */}
      <div>
        <h3>Your Holdings</h3>
        {userHoldings.length > 0 ? (
          <ul>
            {userHoldings.map((holding, index) => {
              const coinName = holding.coinName.toLowerCase();
              const coinPrice = coinPrices[coinName];
              const totalValue = coinPrice ? holding.amount * coinPrice.usd : 0;
              return (
                <li key={index}>
                  {holding.coinName}: {holding.amount} - ${totalValue.toFixed(2)}
                </li>
              );
            })}
          </ul>
        ) : (
          <p>No holdings found. Please add some coins.</p>
        )}
      </div>

      {/* Render Pie Chart */}
      <div>
        <h3>Your Portfolio Breakdown</h3>
        <canvas ref={chartRef} id="chart-container" width="400" height="400"></canvas>
      </div>
    </div>
  );
}
