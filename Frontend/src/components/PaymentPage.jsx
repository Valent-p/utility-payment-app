import { useState } from "react";
import { processPayment } from "../api";

export default function PaymentPage({ accountNumber, onPaymentSuccess }) {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(null);

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

    setLoading(true);
    try {
      const data = await processPayment(accountNumber, amount);
      setSuccess(data);
      setAmount("");
      if (onPaymentSuccess) onPaymentSuccess();
    } catch (err) {
      setError("Payment processing failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {!accountNumber ? (
        <div className="alert alert-info">
          👉 Please lookup a bill first to proceed with payment.
        </div>
      ) : (
        <div className="paychangu-simulation">
          <div className="paychangu-header" style={{ textAlign: "center", marginBottom: "20px" }}>
            <h2 style={{ color: "#00b2a9" }}>PayChangu</h2>
            <p>Secure Checkout Simulation</p>
          </div>
          <form onSubmit={handleSubmit} style={{ border: "1px solid #ccc", padding: "20px", borderRadius: "8px", backgroundColor: "#fafafa" }}>
            <div className="form-group">
              <label htmlFor="account">Utility Account Number</label>
              <input
                type="text"
                id="account"
                value={accountNumber}
                disabled
                style={{ backgroundColor: "#e9ecef" }}
              />
            </div>

            <div className="form-group">
              <label htmlFor="amount">Amount to Pay (MWK)</label>
              <input
                type="number"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount (e.g. 5000)"
                step="0.01"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || !accountNumber || !amount}
              style={{ width: "100%", backgroundColor: "#00b2a9", border: "none", marginTop: "10px" }}
            >
              {loading ? "Processing via PayChangu..." : `Pay MWK ${amount || "0"}`}
            </button>
          </form>
        </div>
      )}

      {error && <div className="alert alert-error">{error}</div>}

      {success && (
        <div className="customer-info">
          <div className="alert alert-success">
            ✓ Payment processed successfully!
          </div>
          <h3 style={{ marginBottom: "15px", color: "#333" }}>
            Payment Details
          </h3>
          <div className="info-item">
            <span className="info-label">Reference:</span>
            <span className="info-value">
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
            <span className="info-value">
              {success.transaction.payment_status.toUpperCase()}
            </span>
          </div>
          <div className="info-item">
            <span className="info-label">Date:</span>
            <span className="info-value">
              {new Date(success.transaction.created_at).toLocaleString()}
            </span>
          </div>
          <div className="info-item">
            <span className="info-label">Bill Status:</span>
            <span className="info-value">
              {success.bill_status.toUpperCase().replace("_", " ")}
            </span>
          </div>
        </div>
      )}

      {loading && (
        <div className="loading">
          <div className="spinner"></div>
          <p>Processing your payment...</p>
        </div>
      )}
    </div>
  );
}

