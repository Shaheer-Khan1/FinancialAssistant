import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css'; // Add custom styles here
import IncomeCharts from '../../Components/IncomeCharts';
import Crypto from '../../Components/Crypto';
import ExpenseChart from '../../Components/ExpenseChart';
import HighestBudget from '../../Components/HighestBudget';
import BudgetRemaining from '../../Components/BudgetRemaining';

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
      <section className="hero-section">
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

      <section className="overview">
      <h2>Hello, {userData.email}</h2> {/* Display user name */}
        <h2>Your Savings</h2>
        <p>
    Congratulations! You currently have <strong>${userData.savings}</strong> in savings.<br/> <br/>This is a great step toward achieving your financial goals. 
    <br/><br/>Whether you're saving for a rainy day, a big purchase, or long-term security, your progress shows that you're making smart financial decisions. 
    <br/><br/>Keep up the excellent work, and continue building towards a secure and prosperous future. 
    <br/><br/>Remember, every dollar saved brings you closer to your dreams.
    <br/>
    <br/>
    <br/>
    <br/>
    <br/>
    <br/>
    Happy Saving!
  </p>
      </section>

      {/* Income Section */}
      <section className="income-section">
        <h2>Income</h2>
        <IncomeCharts/>
        <p>Understanding your income is a crucial step in managing your financial health. Income refers to the money you earn from various sources, such as your salary, investments, business earnings, and other financial assets. It plays a key role in budgeting, saving, and planning for your financial future. By tracking your income, you can better assess your financial situation and make informed decisions about spending, saving, and investing.</p>
        <p>Use our sleek Dashboard to enter your incomes and then see those in form of visual graphs here. Press the button below to try now.</p>
        <button onClick={() => navigate('/income')}>Enter Income</button>
      </section>

      {/* Expenses Section */}
      <section className="expenses-section">
        <h2>Expenses</h2>
        <ExpenseChart/>
        <p>
    Tracking your expenses is an essential part of managing your finances. <br/>By adding your daily, weekly, or monthly expenses, you can gain valuable insights into where your money is going. With our graphical representations, you’ll easily see how your spending patterns are evolving, helping you make smarter financial decisions. 
    <br/><br/><br/>Use the button below to enter your expenses and visualize your spending habits.
  </p>
        <button onClick={() => navigate('/expenses')}>Enter Expenses</button>
      </section>

      {/* Budget Section */}
      <section className="budget-section">
      <p>A budget is a financial plan that helps you manage your money by outlining your income and expenses over a specific period. Setting a monthly budget allows you to track your spending and ensure you are living within your means. By allocating a certain amount of money for different categories like food, entertainment, and savings, you can avoid overspending and make informed decisions about where to cut back if needed. 
    Monitoring your remaining budget is key to staying on track and achieving your financial goals. 
  </p>
        <HighestBudget/>
        <BudgetRemaining/>
        
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
