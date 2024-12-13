import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CryptoDashboard.css'

export default function CryptoDashboard() {
  const [coinList, setCoinList] = useState([]);
  const [filteredCoins, setFilteredCoins] = useState([]);
  const [selectedCoin, setSelectedCoin] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch list of coins from CoinGecko API
  useEffect(() => {
    axios
      .get('https://api.coingecko.com/api/v3/coins/list')
      .then((response) => {
        setCoinList(response.data);
        setFilteredCoins(response.data);  // Set filtered coins as the full list initially
      })
      .catch((error) => {
        console.error('Error fetching coins:', error);
        setError('Failed to load cryptocurrency list');
      });
  }, []);

  // Filter coins based on search input
  useEffect(() => {
    if (searchTerm) {
      const filtered = coinList.filter((coin) =>
        coin.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCoins(filtered);
    } else {
      setFilteredCoins(coinList);  // Reset filter when search is empty
    }
  }, [searchTerm, coinList]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedCoin || !amount) {
      setError('Please select a coin and enter an amount.');
      return;
    }

    const userEmail = JSON.parse(localStorage.getItem('userData'))?.email;  

    if (!userEmail) {
      setError('User is not logged in.');
      return;
    }

    const data = {
      email: userEmail, 
      coinName: selectedCoin,
      amount: parseFloat(amount),
    };

    // Send the data to the backend API
    axios
      .post('http://localhost:5000/api/auth/crypto', data)
      .then((response) => {
        setSuccessMessage('Crypto data submitted successfully!');
        setError('');
        setAmount('');
        setSelectedCoin('');
      })
      .catch((error) => {
        console.error('Error submitting crypto data:', error);
        setError('Failed to submit crypto data');
      });
  };

  return (
    <div className="crypto-form-container">
      <h1>Submit Cryptocurrency Data</h1>
      
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {successMessage && <div style={{ color: 'green' }}>{successMessage}</div>}

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="search">Search Cryptocurrency:</label>
          <input
            type="text"
            id="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by coin name"
          />
        </div>

        <div>
          <label htmlFor="coinName">Select Cryptocurrency:</label>
          <select
            id="coinName"
            value={selectedCoin}
            onChange={(e) => setSelectedCoin(e.target.value)}
          >
            <option value="">Select a Coin</option>
            {filteredCoins.map((coin) => (
              <option key={coin.id} value={coin.id}>
                {coin.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="amount">Amount:</label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="0"
            step="any"
            required
          />
        </div>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
