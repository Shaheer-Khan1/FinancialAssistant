import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css'; // Add custom styles here
import IncomeCharts from '../../Components/IncomeCharts';
import Crypto from '../../Components/Crypto';
import ExpenseChart from '../../Components/ExpenseChart';
import HighestBudget from '../../Components/HighestBudget';

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
      <h1>Your Financial Assistant</h1> {/* Display user name */}
      <section className="overview">
      <h2>Hello, {userData.email}</h2> {/* Display user name */}
        <h2>Your Savings</h2>
        <p>
    Congratulations! You currently have <strong>${userData.savings}</strong> in savings. This is a great step toward achieving your financial goals. 
    Whether you're saving for a rainy day, a big purchase, or long-term security, your progress shows that you're making smart financial decisions. 
    Keep up the excellent work, and continue building towards a secure and prosperous future. 
    Remember, every dollar saved brings you closer to your dreams.
  </p>
      </section>

      {/* Income Section */}
      <section className="income-section">
        <h2>Income</h2>
        <IncomeCharts/>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus imperdiet, nulla et dictum interdum, nisi lorem egestas odio, vitae scelerisque enim ligula venenatis dolor.</p>
        <button onClick={() => navigate('/income')}>Enter Income</button>
      </section>

      {/* Expenses Section */}
      <section className="expenses-section">
        <h2>Expenses</h2>
        <ExpenseChart/>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus imperdiet, nulla et dictum interdum, nisi lorem egestas odio, vitae scelerisque enim ligula venenatis dolor.</p>
        <button onClick={() => navigate('/expenses')}>Enter Expenses</button>
      </section>

      {/* Budget Section */}
      <section className="budget-section">
        <h2>Budget</h2>
        <HighestBudget/>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus imperdiet, nulla et dictum interdum, nisi lorem egestas odio, vitae scelerisque enim ligula venenatis dolor.</p>
        <button onClick={() => navigate('/budget')}>Set Budget</button>
      </section>

      {/* Savings Section */}
      <section className="savings-section">
        <h2>Savings</h2>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus imperdiet, nulla et dictum interdum, nisi lorem egestas odio, vitae scelerisque enim ligula venenatis dolor.</p>
        <button onClick={() => navigate('/savings')}>Track Savings</button>
      </section>

      {/* Crypto Section */}
      <section className="crypto-section">
        <h2>Crypto Dashboard</h2>
        <Crypto/>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus imperdiet, nulla et dictum interdum, nisi lorem egestas odio, vitae scelerisque enim ligula venenatis dolor.</p>
        <button onClick={() => navigate('/crypto')}>Crypto Dashboard</button>
      </section>

      {/* Zakat Section */}
      <section className="zakat-section">
        <h2>Zakat Calculator</h2>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus imperdiet, nulla et dictum interdum, nisi lorem egestas odio, vitae scelerisque enim ligula venenatis dolor.</p>
        <button onClick={() => navigate('/zakat')}>Zakat Calculator</button>
      </section>

      {/* Debts Section */}
      <section className="debts-section">
        <h2>Manage Debts</h2>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus imperdiet, nulla et dictum interdum, nisi lorem egestas odio, vitae scelerisque enim ligula venenatis dolor.</p>
        <button onClick={() => navigate('/debts')}>Manage Debts</button>
      </section>

      {/* Subscriptions Section */}
      <section className="subscriptions-section">
        <h2>Track Subscriptions</h2>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus imperdiet, nulla et dictum interdum, nisi lorem egestas odio, vitae scelerisque enim ligula venenatis dolor.</p>
        <button onClick={() => navigate('/subscriptions')}>Track Subscriptions</button>
      </section>

      {/* Motivational Tips Section */}
      <section className="motivational-tips">
        <h2>Motivational Tip for You</h2>
        <p>“A goal without a plan is just a wish.” – Antoine de Saint-Exupéry</p>
      </section>
    </div>
  );
}
