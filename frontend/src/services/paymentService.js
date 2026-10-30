import api from "./api";

// Add Payment
export const addPayment = async (data) => {
  const res = await api.post("/payment", data);
  return res.data;
};

// Get Customer Payment History
export const getPaymentHistory = async (customerId) => {
  const res = await api.get(
    `/payment/customer/${customerId}`
  );

  return res.data;
};

// Get Single Payment
export const getPaymentById = async (id) => {
  const res = await api.get(`/payment/${id}`);

  return res.data;
};

// Update Payment
export const updatePayment = async (id, data) => {
  const res = await api.put(
    `/payment/${id}`,
    data
  );

  return res.data;
};

// Delete Payment
export const deletePayment = async (id) => {
  const res = await api.delete(
    `/payment/${id}`
  );

  return res.data;
};