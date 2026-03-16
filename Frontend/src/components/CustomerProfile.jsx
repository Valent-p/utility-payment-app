import React, { useState, useEffect } from 'react';
import { fetchCustomerProfile, updateCustomerProfile } from '../api';
import '../styles/CustomerProfile.css';

function CustomerProfile({ accountNumber }) {
  const [customer, setCustomer] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (accountNumber) {
      const loadProfile = async () => {
        setLoading(true);
        try {
          const response = await fetchCustomerProfile(accountNumber);
          if (response.success) {
            setCustomer(response.customer);
            setEditData(response.customer);
            setMessage('Profile loaded');
          }
        } catch (err) {
          setError('Profile load failed');
        } finally {
          setLoading(false);
        }
      };
      loadProfile();
    }
  }, [accountNumber]);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData({
      ...editData,
      [name]: value,
    });
  };

  const handleSaveChanges = async () => {
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await updateCustomerProfile(accountNumber, {
        name: editData.name,
        phone: editData.phone,
        address: editData.address,
      });
      if (response.success) {
        setCustomer(response.customer);
        setIsEditing(false);
        setMessage('Profile updated successfully');
      } else {
        setError(response.message || 'Update failed');
      }
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData(customer);
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        {customer ? (
          <div>
            {error && <div className="error-message">{error}</div>}
            {/* {message && <div className="success-message">{message}</div>} */}

            {!isEditing ? (
              <div className="profile-view">
                <div className="profile-field">
                  <label>Account Number:</label>
                  <p>{customer.account_number}</p>
                </div>

                <div className="profile-field">
                  <label>Full Name:</label>
                  <p>{customer.name}</p>
                </div>

                <div className="profile-field">
                  <label>Phone Number:</label>
                  <p>{customer.phone}</p>
                </div>

                <div className="profile-field">
                  <label>Address:</label>
                  <p>{customer.address}</p>
                </div>

                <div className="profile-field">
                  <label>Meter Number:</label>
                  <p>{customer.meter_number}</p>
                </div>

                <div className="profile-field">
                  <label>Member Since:</label>
                  <p>{new Date(customer.created_at).toLocaleDateString()}</p>
                </div>

                <div className="button-group">
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="btn-edit"
                  >
                    Edit Profile
                  </button>
                </div>
              </div>
            ) : (
              <div className="profile-edit">
                <div className="form-group">
                  <label htmlFor="name">Full Name:</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={editData.name}
                    onChange={handleEditChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Phone Number:</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={editData.phone}
                    onChange={handleEditChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="address">Address:</label>
                  <textarea
                    id="address"
                    name="address"
                    value={editData.address}
                    onChange={handleEditChange}
                  />
                </div>

                <div className="button-group">
                  <button 
                    onClick={handleSaveChanges}
                    disabled={loading}
                    className="btn-save"
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button 
                    onClick={handleCancel}
                    className="btn-cancel"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="loading">
            <p>Loading your profile...</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default CustomerProfile;

