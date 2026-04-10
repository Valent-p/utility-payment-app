import React, { useState } from "react";
import { registerCustomer } from "../api";
import "../styles/RegisterCustomer.css";

function RegisterCustomer({ onRegister }) {
  const [formData, setFormData] = useState({
    account_number: "",
    password: "",
    name: "",
    phone: "",
    address: "",
    meter_number: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await registerCustomer(formData);
      if (response.success) {
        setMessage("Registration successful! Logging you in...");
        if (onRegister) {
          onRegister(formData.account_number);
        }
        setFormData({
          account_number: "",
          password: "",
          name: "",
          phone: "",
          address: "",
          meter_number: "",
        });
        setTimeout(() => setMessage("Redirecting to dashboard..."), 1500);
      } else {
        setError(response.message || "Registration failed");
      }
    } catch (err) {
      setError(err.message || "An error occurred during registration");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2>Create WaterBoard Account</h2>
        <p>Join our water utility service</p>

        {error && <div className="error-message">{error}</div>}
        {message && <div className="success-message">{message}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="account_number">Account Number</label>
              <input
                type="text"
                id="account_number"
                name="account_number"
                value={formData.account_number}
                onChange={handleChange}
                placeholder="e.g., ACC001"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="meter_number">Meter Number</label>
              <input
                type="text"
                id="meter_number"
                name="meter_number"
                value={formData.meter_number}
                onChange={handleChange}
                placeholder="e.g., MTR001"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create password (min 6 chars)"
              required
              minLength="6"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Kondwani Phiri"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Phone</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+265881234567"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="address">Address</label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter your full address"
              required
              rows="3"
            />
          </div>

          <button type="submit" disabled={loading} className="register-btn">
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <div className="register-footer">
          <p>Already have an account? <a href="/login">Sign In</a></p>
        </div>
      </div>
    </div>
  );
}

export default RegisterCustomer;

