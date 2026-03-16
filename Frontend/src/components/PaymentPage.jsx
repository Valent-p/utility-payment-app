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
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="account">Account Number</label>
            <input
              type="text"
              id="account"
              value={accountNumber}
              disabled
              style={{ backgroundColor: "#f0f0f0" }}
            />
          </div>

          <div className="form-group">
            <label htmlFor="amount">Payment Amount (KES)</label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount to pay"
              step="0.01"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading || !accountNumber}
          >
            {loading ? "Processing Payment..." : "Pay Bill"}
          </button>
        </form>
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
              KES {parseFloat(success.transaction.amount).toFixed(2)}
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

