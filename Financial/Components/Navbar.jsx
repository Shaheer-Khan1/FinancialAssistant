import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom'; // Import useLocation from react-router-dom
import './Navbar.css';

const ScrollWheelNavbar = () => {
  const navigate = useNavigate(); // Hook to navigate programmatically
  const location = useLocation(); // Hook to get the current location (route)

  const logout = () => {
    // Clear the local storage
    localStorage.clear();

    // Navigate to the home page after logout
    navigate('/');
  };

  // Don't render the navbar if the current route is "/"
  if (location.pathname === '/') {
    return null;
  }

  return (
    <div className="scroll-wheel-navbar">
      <ul className="nav-list">
        <li>
          <Link to="/" className="nav-button">
            <span>Home</span>
          </Link>
        </li>
        <li>
          <Link to="/dashboard" className="nav-button">
            <span>Dashboard</span>
          </Link>
        </li>
        <li>
          <Link to="/income" className="nav-button">
            <span>Income</span>
          </Link>
        </li>
        <li>
          <Link to="/crypto" className="nav-button">
            <span>Crypto Dashboard</span>
          </Link>
        </li>
        <li>
          <Link to="/zakat" className="nav-button">
            <span>Zakat Calculator</span>
          </Link>
        </li>
        <li>
          <Link to="/expenses" className="nav-button">
            <span>Expenses</span>
          </Link>
        </li>
        <li>
          <Link to="/budget" className="nav-button">
            <span>Budget</span>
          </Link>
        </li>
        <li>
          <button onClick={logout} className="nav-button">
            <span>Logout</span>
          </button>
        </li>
      </ul>
    </div>
  );
};

export default ScrollWheelNavbar;
