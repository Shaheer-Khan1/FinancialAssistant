import React, { useState } from 'react';
import AuthForm from '../../Components/AuthForm';
import './LoginRegister.css';

export default function LoginRegister() {
  const [isSignup, setIsSignup] = useState(true); // Default to signup view

  // Log when the form is submitted
  const handleFormSubmit = (data) => {
    console.log('Form submitted with data:', data);

    // Log token if it exists
    if (data.token) {
      console.log('User token received:', data.token);
      // Redirect or do something on successful login/signup
      console.log('User logged in or signed up successfully');
    } else {
      console.log('No token found, possible error in login/signup');
    }
  };

  // Log when the form view switches
  const handleToggleClick = () => {
    console.log('Switching form view:', isSignup ? 'Signup' : 'Login');
    setIsSignup(!isSignup);
  };

  return (
    <div className="app-container">
      <div className="form-container">

        <AuthForm isSignup={isSignup} onSubmit={handleFormSubmit} />
        
        <div className="toggle-button">
          <button onClick={handleToggleClick}>
            {isSignup ? 'Switch to Login' : 'Switch to Sign Up'}
          </button>
        </div>
      </div>
    </div>
  );
}
