import api from "./api";

// Get Complete Customer Details
export const getCustomerDetails = async (customerId) => {
  const res = await api.get(
    `/customers/${customerId}/details`
  );

  return res.data;
};

// ==========================================
// MILK
// ==========================================

// Add Milk
export const addMilk = async (data) => {
  const res = await api.post("/milk", data);
  return res.data;
};

// Update Milk
export const updateMilk = async (id, data) => {
  const res = await api.put(
    `/milk/${id}`,
    data
  );

  return res.data;
};

// Delete Milk
export const deleteMilk = async (id) => {
  const res = await api.delete(
    `/milk/${id}`
  );

  return res.data;
};

// ==========================================
// PAYMENT
// ==========================================

// Add Payment
export const addPayment = async (data) => {
  const res = await api.post(
    "/payment",
    data
  );

  return res.data;
};

// Update Payment
export const updatePayment = async (
  id,
  data
) => {
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

// ==========================================
// PRINT
// ==========================================

export const printStatement = () => {
  window.print();
};