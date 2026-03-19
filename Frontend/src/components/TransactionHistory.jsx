import { useState, useEffect } from 'react';
import { fetchTransactions } from '../api';

export default function TransactionHistory({ accountNumber }) {
    const [transactions, setTransactions] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (accountNumber) {
            loadTransactions();
        }
    }, [accountNumber]);

    const loadTransactions = async () => {
        setError('');
        setLoading(true);
        try {
            const data = await fetchTransactions(accountNumber);
            setTransactions(data.transactions);
        } catch (err) {
            setError('Failed to load transactions');
        } finally {
            setLoading(false);
        }
    };

    if (!accountNumber) {
        return (
            <div className="alert alert-info">
                👉 Please lookup a bill first to view transaction history.
            </div>
        );
    }

    return (
        <div>
            <div style={{ marginBottom: '20px' }}>
                <button
                    className="btn btn-primary"
                    onClick={loadTransactions}
                    disabled={loading}
                >
                    {loading ? 'Loading...' : 'Refresh'}
                </button>
            </div>

            {error && <div className="alert alert-error">{error}</div>}

            {loading && (
                <div className="loading">
                    <div className="spinner"></div>
                    <p>Loading transactions...</p>
                </div>
            )}

            {transactions && transactions.length > 0 ? (
                <div>
                    <h3 style={{ marginBottom: '15px', color: '#333' }}>
                        Payment History ({transactions.length})
                    </h3>
                    <ul className="transaction-list">
                        {transactions.map((transaction, index) => (
                            <li key={transaction.id} className="transaction-item">
                                <div className="transaction-header">
                                    <span className="transaction-ref">
                                        #{index + 1} - {transaction.payment_reference}
                                    </span>
                                    <span className={`transaction-status status-${transaction.payment_status}`}>
                                        {transaction.payment_status.toUpperCase()}
                                    </span>
                                </div>
                                <div className="transaction-details">
                                    <div className="info-item" style={{ marginBottom: '5px', paddingBottom: '5px', borderBottom: 'none' }}>
                                        <span className="info-label">Amount:</span>
                                        <span className="info-value">MWK {parseFloat(transaction.amount).toFixed(2)}</span>
                                    </div>
                                    <div className="info-item" style={{ marginBottom: '0', paddingBottom: '0', borderBottom: 'none' }}>
                                        <span className="info-label">Date:</span>
                                        <span className="info-value">
                                            {new Date(transaction.created_at).toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                !loading && (
                    <div className="no-data">
                        <div className="no-data-icon">📋</div>
                        <p>No transactions found for this account.</p>
                    </div>
                )
            )}
        </div>
    );
}

