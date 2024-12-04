import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css'; // Add custom styles here
import IncomeCharts from '../../Components/IncomeCharts';
import Crypto from '../../Components/Crypto';
import ExpenseChart from '../../Components/ExpenseChart';
import HighestBudget from '../../Components/HighestBudget';
import BudgetRemaining from '../../Components/BudgetRemaining';
import SavingChart from '../../Components/SavingChart';
import ShowDebt from '../../Components/ShowDebt';

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
      {/* Navbar */}
      <nav className="navbar">
        <ul>
          <li><a href="#hero-section">Home</a></li>
          <li><a href="#income-section">Income</a></li>
          <li><a href="#expenses-section">Expenses</a></li>
          <li><a href="#budget-section">Budget</a></li>
          <li><a href="#savings-section">Savings</a></li>
          <li><a href="#crypto-section">Crypto</a></li>
          <li><a href="#zakat-section">Zakat</a></li>
          <li><a href="#debts-section">Debts</a></li>
          <li><a href="#subscriptions-section">Subscriptions</a></li>
        </ul>
      </nav>

      {/* Hero Section */}
      <section id="hero-section" className="hero-section">
        <div className="circle"></div> {/* The revolving circle */}
        <div className="hero-content">
          <h1 className="hero-title">
            Your Financial Assistant
            <span className="hero-highlight"> Awaits!</span>
          </h1>
          <p className="hero-description">
            Unlock the path to financial freedom with ease. Manage your income, track expenses, save smarter, and make informed decisions—all in one place. 
            Your journey to prosperity begins here!
          </p>
        </div>
      </section>

      {/* Overview Section */}
      <section id="overview" className="overview">
        <h2>Hello, {userData.email}</h2>
        <h2>Your Savings</h2>
        <p>
          Congratulations! You currently have <strong>${userData.savings}</strong> in savings.<br/><br/>
          This is a great step toward achieving your financial goals. Whether you're saving for a rainy day, a big purchase, or long-term security, your progress shows that you're making smart financial decisions. 
          Keep up the excellent work, and continue building towards a secure and prosperous future. Remember, every dollar saved brings you closer to your dreams.<br/><br/>
          Happy Saving!
        </p>
      </section>

      {/* Income Section */}
      <section id="income-section" className="income-section">
        <h2>Income</h2>
        <IncomeCharts />
        <p>
          Understanding your income is a crucial step in managing your financial health. Income refers to the money you earn from various sources, such as your salary, investments, business earnings, and other financial assets.
          It plays a key role in budgeting, saving, and planning for your financial future.
        </p>
        <button onClick={() => navigate('/income')}>Enter Income</button>
      </section>

      {/* Expenses Section */}
      <section id="expenses-section" className="expenses-section">
        <h2>Expenses</h2>
        <ExpenseChart />
        <p>
          Tracking your expenses is an essential part of managing your finances. By adding your daily, weekly, or monthly expenses, you can gain valuable insights into where your money is going. 
          With our graphical representations, you’ll easily see how your spending patterns are evolving, helping you make smarter financial decisions.
        </p>
        <button onClick={() => navigate('/expenses')}>Enter Expenses</button>
      </section>

      {/* Budget Section */}
      <section id="budget-section" className="budget-section">
        <p>
          A budget is a financial plan that helps you manage your money by outlining your income and expenses over a specific period. Setting a monthly budget allows you to track your spending and ensure you are living within your means.
          Monitoring your remaining budget is key to staying on track and achieving your financial goals.
        </p>
        <HighestBudget />
        <BudgetRemaining />
        <button onClick={() => navigate('/budget')}>Set Budget</button>
      </section>

      {/* Savings Section */}
      <section id="savings-section" className="savings-section">
        <h2>Savings</h2>
        <SavingChart />
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus imperdiet, nulla et dictum interdum, nisi lorem egestas odio, vitae scelerisque enim ligula venenatis dolor.</p>
        <button onClick={() => navigate('/savings')}>Track Savings</button>
      </section>

      {/* Crypto Section */}
      <section id="crypto-section" className="crypto-section">
        <h2>Crypto Dashboard</h2>
        <Crypto />
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus imperdiet, nulla et dictum interdum, nisi lorem egestas odio, vitae scelerisque enim ligula venenatis dolor.</p>
        <button onClick={() => navigate('/crypto')}>Crypto Dashboard</button>
      </section>

      {/* Zakat Section */}
      <section id="zakat-section" className="zakat-section">
        <h2>Zakat Calculator</h2>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus imperdiet, nulla et dictum interdum, nisi lorem egestas odio, vitae scelerisque enim ligula venenatis dolor.</p>
        <button onClick={() => navigate('/zakat')}>Zakat Calculator</button>
      </section>

      {/* Debts Section */}
      <section id="debts-section" className="debts-section">
        <h2>Manage Debts</h2>
        <ShowDebt />
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus imperdiet, nulla et dictum interdum, nisi lorem egestas odio, vitae scelerisque enim ligula venenatis dolor.</p>
        <button onClick={() => navigate('/debts')}>Manage Debts</button>
      </section>

      {/* Subscriptions Section */}
      <section id="subscriptions-section" className="subscriptions-section">
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
