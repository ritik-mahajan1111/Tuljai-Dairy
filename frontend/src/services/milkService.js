import api from "./api";

export const addMilkEntry = async (data) => {
  const res = await api.post("/milk", data);
  return res.data;
};

export const getMilkHistory = async (customerId) => {
  const res = await api.get(`/milk/customer/${customerId}`);
  return res.data;
};

export const updateMilkEntry = async (id, data) => {
  const res = await api.put(`/milk/${id}`, data);
  return res.data;
};

export const deleteMilkEntry = async (id) => {
  const res = await api.delete(`/milk/${id}`);
  return res.data;
};