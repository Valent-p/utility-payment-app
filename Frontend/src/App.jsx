import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import BillLookup from './components/BillLookup.jsx';
import PaymentPage from './components/PaymentPage.jsx';
import TransactionHistory from './components/TransactionHistory.jsx';
import RegisterCustomer from './components/RegisterCustomer.jsx';
import CustomerProfile from './components/CustomerProfile.jsx';
import Login from './components/Login.jsx';
import Dashboard from './components/Dashboard.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import './index.css';

export default function App() {
  const [accountNumber, setAccountNumber] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const acc = localStorage.getItem('accountNumber');
    if (acc) {
      setAccountNumber(acc);
      setLoggedIn(true);
    }
  }, []);

  const handleLogin = (accNum) => {
    localStorage.setItem('accountNumber', accNum);
    setAccountNumber(accNum);
    setLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('accountNumber');
    setAccountNumber('');
    setLoggedIn(false);
  };

  const handleBillFound = (accNum) => {
    setAccountNumber(accNum);
  };

  const handlePaymentSuccess = () => {
    // placeholder — Transaction list will fetch latest
  };

  return (
    <BrowserRouter>
      <div className="container">
        <div className="header">
          <h1>💧 Water Utility Payments</h1>
          <p>Quick and easy bill payment system</p>
        </div>

        <nav className="nav-buttons">
          {!loggedIn ? (
            <>
              <Link className="nav-btn" to="/login">Login</Link>
              <Link className="nav-btn" to="/register">Register</Link>
            </>
          ) : (
            <>
              <Link className="nav-btn" to="/dashboard">Dashboard</Link>
              <Link className="nav-btn" to="/profile">My Profile</Link>
              <Link className="nav-btn" to="/lookup">Check Bill</Link>
              <Link className="nav-btn" to="/payment">Pay Bill</Link>
              <Link className="nav-btn" to="/history">History</Link>
              <button className="nav-btn" onClick={handleLogout}>Logout</button>
            </>
          )}
        </nav>

        <Routes>
          <Route path="/" element={<Navigate to={loggedIn ? '/dashboard' : '/login'} replace />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/register" element={<RegisterCustomer onRegister={handleLogin} />} />
          <Route 
            path="/lookup" 
            element={
              <ProtectedRoute loggedIn={loggedIn}>
                <BillLookup accountNumber={accountNumber} />
              </ProtectedRoute>
            } 
          />


          <Route
            path="/dashboard"
            element={
              <ProtectedRoute loggedIn={loggedIn}>
                <Dashboard accountNumber={accountNumber} onLogout={handleLogout} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/payment"
            element={
              <ProtectedRoute loggedIn={loggedIn}>
                <PaymentPage accountNumber={accountNumber} onPaymentSuccess={handlePaymentSuccess} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/history"
            element={
              <ProtectedRoute loggedIn={loggedIn}>
                <TransactionHistory accountNumber={accountNumber} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute loggedIn={loggedIn}>
                <CustomerProfile accountNumber={accountNumber} />
              </ProtectedRoute>
            }
          />


          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

