import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchBill } from "../api";
import "../styles/Dashboard.css";

function Dashboard({ accountNumber, onLogout }) {
  const navigate = useNavigate();
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
            <div className="bill-card">
              <div className="bill-header">
                <h3>Bill for {billData.period || billData.billing_month}</h3>
                <span className={`status-badge ${billData.status}`}>{billData.status.toUpperCase()}</span>
              </div>
              <div className="bill-details">
                <div className="detail-item">
                  <span className="label">Amount Due</span>
                  <span className="value text-primary">MWK {billData.amount_due}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Due Date</span>
                  <span className="value">{billData.due_date}</span>
                </div>
                {billData.meter_reading_previous && (
                  <>
                    <div className="detail-item">
                      <span className="label">Prev Reading</span>
                      <span className="value">{billData.meter_reading_previous} m³</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Current Reading</span>
                      <span className="value">{billData.meter_reading_current} m³</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Consumption</span>
                      <span className="value">{billData.consumption} m³</span>
                    </div>
                  </>
                )}
              </div>
              {billData.status === "unpaid" && (
                <button onClick={() => navigate("/payment")} className="btn-pay">
                  Pay Now
                </button>
              )}
            </div>
          </div>
        ) : (
          !loading && <div className="no-bill"><p>No outstanding bill found.</p></div>
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

