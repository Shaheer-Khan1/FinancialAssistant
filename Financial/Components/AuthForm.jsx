import React, { useState, useEffect } from 'react';
import './AuthForm.css'; 
import axios from 'axios'; 
import { useNavigate } from 'react-router-dom'; 

const api = axios.create({
  baseURL: 'http://localhost:5000',
});

const AuthForm = ({ isSignup, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);  
  const [error, setError] = useState('');         
  const [successMessage, setSuccessMessage] = useState(''); 

  const navigate = useNavigate(); 

  // Check if there's any stored user data in localStorage
  const storedUserData = JSON.parse(localStorage.getItem('userData'));

  useEffect(() => {
    if (storedUserData) {
      setFormData(storedUserData); // Populate form with stored data
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);  
    setError('');      
    setSuccessMessage(''); 

    try {
      const apiUrl = isSignup ? '/api/auth/register' : '/api/auth/login';
      const response = await api.post(apiUrl, formData);

      onSubmit(response.data);

      if (response.data.token) {
        localStorage.setItem('token', response.data.token); 
        localStorage.setItem('userData', JSON.stringify(formData)); // Store user data

        if (isSignup) {
          setSuccessMessage('Registration successful!');
        } else {
          setSuccessMessage('Login successful!');
          navigate('/dashboard');
        }
      }
    } catch (err) {
      if (isSignup) {
        if (err.response && err.response.data && err.response.data.message === 'Email already exists') {
          setError('Email is already taken.');
        } else {
          setError('Registration error.');
        }
      } else {
        if (err.response && err.response.data && err.response.data.message === 'Invalid credentials') {
          setError('Invalid credentials.');
        } else {
          setError('Login error.');
        }
      }
    } finally {
      setLoading(false); 
    }
  };

  return (
    <>
      <div className='Heading'>
        <h1>Financial Assistant</h1>
      </div>
      <form onSubmit={handleSubmit} className="auth-form">
        <h1>{isSignup ? 'Create your account' : 'Welcome back ...'}</h1>
        {isSignup && (
          <div className="input-group">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Name"
              required
            />
          </div>
        )}
        <div className="input-group">
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            required
          />
        </div>
        <div className="input-group">
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            required
          />
        </div>
        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'Loading...' : isSignup ? 'Create my account' : 'Login'}
        </button>
        {error && <div className="error-message">{error}</div>}
        {successMessage && <div className="success-message">{successMessage}</div>}
      </form>
    </>
  );
};

export default AuthForm;