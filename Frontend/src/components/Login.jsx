import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginCustomer } from '../api';
import '../styles/Login.css';

function Login({ onLogin }) {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    account_number: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({
      ...credentials,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await loginCustomer(credentials);
      if (res.success) {
        onLogin(credentials.account_number);
        navigate('/dashboard');
      } else {
        setError(res.message || 'Login failed');
      }
    } catch (err) {
      setError(err.message || 'Error during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="water-bg"></div>
      <div className="login-card">
        <div className="water-logo">
          💧
        </div>
        <h2>WaterBoard Login</h2>
        <p className="subtitle">Access your water utility account</p>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Account Number</label>
            <input
              type="text"
              name="account_number"
              value={credentials.account_number}
              onChange={handleChange}
              placeholder="Enter account number (e.g., ACC001)"
              required
              disabled={loading}
            />
          </div>
          
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              disabled={loading}
            />
          </div>
          
          <button type="submit" disabled={loading} className="login-btn">
            {loading ? (
              <>
                <span className="spinner"></span>
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>
        
        <div className="login-footer">
          <p>Don't have an account? 
            <Link to="/register" className="signup-link">Sign Up</Link>
          </p>
          <div className="wave"></div>
        </div>
      </div>
    </div>
  );
}

export default Login;

