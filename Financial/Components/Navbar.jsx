import React, { useState } from 'react';
import { Link } from 'react-scroll'; 
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Toggle the menu open/close
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="navbar">
      <div className="logo">Logo</div>

      <div className="hamburger" onClick={toggleMenu}>
        <div className={`line ${isOpen ? 'open' : ''}`}></div>
        <div className={`line ${isOpen ? 'open' : ''}`}></div>
        <div className={`line ${isOpen ? 'open' : ''}`}></div>
      </div>

      <ul className={`nav-links ${isOpen ? 'open' : ''}`}>
        <li><Link to="hero-section" smooth={true} duration={500}>Home</Link></li>
        <li><Link to="income-section" smooth={true} duration={500}>Income</Link></li>
        <li><Link to="expenses-section" smooth={true} duration={500}>Expenses</Link></li>
        <li><Link to="budget-section" smooth={true} duration={500}>Budget</Link></li>
        <li><Link to="savings-section" smooth={true} duration={500}>Savings</Link></li>
        <li><Link to="crypto-section" smooth={true} duration={500}>Crypto</Link></li>
        <li><Link to="zakat-section" smooth={true} duration={500}>Zakat</Link></li>
        <li><Link to="debts-section" smooth={true} duration={500}>Debts</Link></li>
        <li><Link to="subscriptions-section" smooth={true} duration={500}>Subscriptions</Link></li>
        <li><Link to="motivational-tips" smooth={true} duration={500}>Motivational Tip</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
