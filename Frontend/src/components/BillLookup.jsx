import { useState, useEffect } from "react";
import { fetchBill } from "../api";

export default function BillLookup({ accountNumber }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [billData, setBillData] = useState(null);

  useEffect(() => {
    if (accountNumber) {
      const loadBill = async () => {
        setLoading(true);
        try {
          const data = await fetchBill(accountNumber);
          setBillData(data);
        } catch (err) {
          setError("No bill found for your account.");
        } finally {
          setLoading(false);
        }
      };
      loadBill();
    }
  }, [accountNumber]);

  return (
    <div className="page-card">
      <h2>Check Your Bill</h2>
      
      {!accountNumber ? (
        <div className="alert alert-info">
          <p>Please login to check your bill.</p>
        </div>
      ) : loading ? (
        <div className="loading">
          <div className="spinner"></div>
          <p>Fetching your bill...</p>
        </div>
      ) : error ? (
        <div className="alert alert-error">{error}</div>
      ) : billData ? (
        <div className="customer-info">
          <h3>Customer Details</h3>
          <div className="info-item">
            <span className="info-label">Account:</span>
            <span className="info-value">{accountNumber}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Name:</span>
            <span className="info-value">{billData.customer.name}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Phone:</span>
            <span className="info-value">{billData.customer.phone}</span>
          </div>

          {billData.bill ? (
            <div>
              <h3>Outstanding Bill</h3>
              <div className="info-item">
                <span className="info-label">Billing Period:</span>
                <span className="info-value">{billData.bill.billing_month}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Due Date:</span>
                <span className="info-value">{billData.bill.due_date}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Amount Due:</span>
                <span className="amount-due">
                  MWK {parseFloat(billData.bill.amount_due).toFixed(2)}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Status:</span>
                <span className="info-value">{billData.bill.status.toUpperCase()}</span>
              </div>
              <div className="button-group">
                <button className="btn btn-pay">Pay Now</button>
              </div>
            </div>
          ) : (
            <div className="alert alert-success">
              ✓ No outstanding bills! All paid up.
            </div>
          )}
        </div>
      ) : (
        <div className="no-data">
          <div className="no-data-icon">📋</div>
          <p>No bill data available.</p>
        </div>
      )}
    </div>
  );
}

