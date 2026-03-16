const API_URL = "http://localhost:8000/api";

export const fetchBill = async (accountNumber) => {
  try {
    const response = await fetch(`${API_URL}/customers/bill/${accountNumber}/`);
    if (!response.ok) {
      throw new Error("Bill not found");
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const processPayment = async (accountNumber, amount) => {
  try {
    const response = await fetch(`${API_URL}/pay/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        account_number: accountNumber,
        amount: parseFloat(amount),
      }),
    });
    if (!response.ok) {
      throw new Error("Payment processing failed");
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const fetchTransactions = async (accountNumber) => {
  try {
    const response = await fetch(`${API_URL}/transactions/${accountNumber}/`);
    if (!response.ok) {
      throw new Error("Transactions not found");
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
};

// Account Management APIs

export const registerCustomer = async (customerData) => {
  try {
    const response = await fetch(`${API_URL}/customers/customer/register/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(customerData),
    });
    if (!response.ok) {
      throw new Error("Registration failed");
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const loginCustomer = async (credentials) => {
  try {
    const response = await fetch(`${API_URL}/customers/login/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });
    if (!response.ok) {
      throw new Error("Login failed");
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const fetchCustomerProfile = async (accountNumber) => {
  try {
    const response = await fetch(
      `${API_URL}/customers/customer/${accountNumber}/`,
    );
    if (!response.ok) {
      throw new Error("Profile not found");
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const updateCustomerProfile = async (accountNumber, customerData) => {
  try {
    const response = await fetch(
      `${API_URL}/customers/customer/${accountNumber}/`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(customerData),
      },
    );
    if (!response.ok) {
      throw new Error("Profile update failed");
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
};
