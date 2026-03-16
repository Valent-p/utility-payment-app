import React, { useEffect, useState } from "react";
import { fetchBill } from "../api";
import "../styles/Dashboard.css";

function Dashboard({ accountNumber, onPay, onLogout }) {
  const [billData, setBillData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      if (!accountNumber) return;
      setLoading(true);
      setError("");
      try {
        const res = await fetchBill(accountNumber);
        if (res.success) setBillData(res.bill);
        else setError(res.message || "No bill found");
      } catch (err) {
        setError(err.message || "Error loading bill");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [accountNumber]);

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <h2>Dashboard</h2>
        <div className="account-info">
          <strong>Account:</strong> {accountNumber}
        </div>

        {loading && <p>Loading bill...</p>}
        {error && <div className="error-message">{error}</div>}

        {!loading && billData ? (
          <div className="bill-section">
            <p>
              <strong>Billing Month:</strong> {billData.billing_month}
            </p>
            <p>
              <strong>Amount Due:</strong> KES {billData.amount_due}
            </p>
            <p>
              <strong>Due Date:</strong> {billData.due_date}
            </p>
            <p>
              <strong>Status:</strong> {billData.status}
            </p>
            {billData.status === "unpaid" && (
              <button onClick={onPay} className="btn-pay">
                Pay Bill
              </button>
            )}
          </div>
        ) : (
          !loading && <p>No outstanding bill found.</p>
        )}

        <div style={{ marginTop: 16 }}>
          <button onClick={onLogout} className="btn-logout">
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

