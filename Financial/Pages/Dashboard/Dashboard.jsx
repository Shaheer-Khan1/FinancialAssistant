import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css'; // Add custom styles here

export default function Dashboard() {
  const [userData, setUserData] = useState(null); // Store user data
  const [error, setError] = useState(''); // Store any errors
  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve user data from localStorage
    const userDataFromStorage = localStorage.getItem('userData');
    console.log(userDataFromStorage); // Log for debugging
    if (userDataFromStorage) {
      setUserData(JSON.parse(userDataFromStorage)); // Parse and set user data
    } else {
      setError('No user data found.');
    }
  }, []);

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="dashboard-container">
      <h1>Hello, {userData.name}</h1> {/* Display user name */}
      <section className="overview">
        <h2>Your Savings</h2>
        <p>You have ${userData.savings} in savings.</p> {/* Display user savings */}
      </section>

      <section className="menu">
        <h2>What would you like to do?</h2>
        <ul>
          <li><button onClick={() => navigate('/income')}>Enter Income</button></li>
          <li><button onClick={() => navigate('/expenses')}>Enter Expenses</button></li>
          <li><button onClick={() => navigate('/budget')}>Set Budget</button></li>
          <li><button onClick={() => navigate('/savings')}>Track Savings</button></li>
          <li><button onClick={() => navigate('/crypto')}>Crypto Dashboard</button></li>
          <li><button onClick={() => navigate('/zakat')}>Zakat Calculator</button></li>
          <li><button onClick={() => navigate('/debts')}>Manage Debts</button></li>
          <li><button onClick={() => navigate('/subscriptions')}>Track Subscriptions</button></li>
        </ul>
      </section>

      <section className="motivational-tips">
        <h2>Motivational Tip for You</h2>
        <p>“A goal without a plan is just a wish.” – Antoine de Saint-Exupéry</p>
      </section>
    </div>
  );
}
