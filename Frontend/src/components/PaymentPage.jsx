import { useState, useEffect } from "react";
import { processPayment, verifyPayment } from "../api";

export default function PaymentPage({ accountNumber, onPaymentSuccess }) {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(null);
  // Paychangu script is now loaded in index.html
  const scriptLoaded = !!window.PaychanguCheckout;


  const handlePaychanguCheckout = (config) => {
    if (!window.PaychanguCheckout) {
      setError("Paychangu script not loaded. Please refresh the page.");
      setLoading(false);
      return;
    }

    window.PaychanguCheckout({
      ...config,
      callback_url: window.location.href,
      return_url: window.location.href,
      callback: async (response) => {
        setLoading(true);
        try {
          const data = await verifyPayment(config.tx_ref);
          setSuccess(data);
          setAmount("");
          if (onPaymentSuccess) onPaymentSuccess();
        } catch (err) {
          setError("Payment verification failed. Please contact support.");
        } finally {
          setLoading(false);
        }
      },
      onclose: () => {
        setLoading(false);
      },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(null);

    if (!accountNumber) {
      setError("Please lookup a bill first");
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    if (!scriptLoaded) {
      setError("Paychangu checkout is still loading. Please wait a moment.");
      return;
    }

    setLoading(true);
    try {
      const data = await processPayment(accountNumber, amount);
      if (data.success && data.config) {
        handlePaychanguCheckout(data.config);
      } else {
        throw new Error(data.message || "Failed to initiate payment");
      }
    } catch (err) {
      setError(err.message || "Payment initiation failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="page-card">
      <h2>Secure Bill Payment</h2>

      {error && (
        <div className="alert alert-error" style={{ marginBottom: "20px", textAlign: "center" }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {!accountNumber ? (
        <div className="alert alert-info">
          👉 Please lookup a bill first to proceed with payment.
        </div>
      ) : success ? (
        <div className="customer-info" style={{ animation: "fadeIn 0.5s ease" }}>
          <div className="alert alert-success">
            ✓ Payment Verified Successfully!
          </div>
          <h3 style={{ marginBottom: "15px", color: "#333", borderBottom: "1px solid #eee", paddingBottom: "10px" }}>
            Payment Receipt
          </h3>
          <div className="info-item">
            <span className="info-label">Reference:</span>
            <span className="info-value" style={{ fontWeight: "600", color: "#00b2a9" }}>
              {success.transaction.payment_reference}
            </span>
          </div>
          <div className="info-item">
            <span className="info-label">Amount:</span>
            <span className="amount-due">
              MWK {parseFloat(success.transaction.amount).toFixed(2)}
            </span>
          </div>
          <div className="info-item">
            <span className="info-label">Status:</span>
            <span className="info-value" style={{ color: "green" }}>
              {success.transaction.payment_status.toUpperCase()}
            </span>
          </div>
          <div className="info-item">
            <span className="info-label">Date:</span>
            <span className="info-value">
              {new Date(success.transaction.created_at).toLocaleString()}
            </span>
          </div>
          <div className="info-item" style={{ borderBottom: "none" }}>
            <span className="info-label">Bill Status:</span>
            <span className="info-value" style={{ fontWeight: "bold" }}>
              {success.bill_status.toUpperCase().replace("_", " ")}
            </span>
          </div>
          <button 
            className="btn btn-secondary" 
            onClick={() => setSuccess(null)}
            style={{ width: "100%", marginTop: "15px" }}
          >
            Make Another Payment
          </button>
        </div>
      ) : (
        <div className="paychangu-integration">
          <div className="paychangu-header" style={{ textAlign: "center", marginBottom: "20px" }}>
            <img 
              src="https://paychangu.com/assets/images/logo.png" 
              alt="PayChangu" 
              style={{ height: "30px", marginBottom: "10px" }}
              onError={(e) => { e.target.style.display = 'none' }}
            />
            <p style={{ color: "#666", fontSize: "0.9rem" }}>Powered by PayChangu Secure Gateway</p>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="account">Utility Account Number</label>
              <input
                type="text"
                id="account"
                value={accountNumber}
                disabled
                style={{ backgroundColor: "#f8f9fa" }}
              />
            </div>

            <div className="form-group">
              <label htmlFor="amount">Amount to Pay (MWK)</label>
              <input
                type="number"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount (Min 50 MWK)"
                step="0.01"
                disabled={loading}
                autoFocus
              />
            </div>

            <button
              type="submit"
              className="btn btn-pay"
              disabled={loading || !accountNumber || !amount || !scriptLoaded}
            >
              {loading ? "Initializing..." : `Pay MWK ${amount || "0.00"}`}
            </button>
            
            {!scriptLoaded && (
              <p style={{ fontSize: "0.8rem", textAlign: "center", color: "#999", marginTop: "15px" }}>
                ⏳ Connecting to PayChangu...
              </p>
            )}
          </form>
        </div>
      )}

      {loading && !success && !error && (
        <div className="loading-overlay" style={{ textAlign: "center", padding: "20px" }}>
          <div className="spinner" style={{ margin: "0 auto" }}></div>
          <p>Processing...</p>
        </div>
      )}
    </div>
  );
}
