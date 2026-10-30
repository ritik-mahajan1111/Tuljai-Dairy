import api from "./api";

export const getCustomers = async () => {
  const res = await api.get("/customers");
  return res.data;
};

export const getCustomerById = async (id) => {
  const res = await api.get(`/customers/${id}`);
  return res.data;
};

export const addCustomer = async (data) => {
  const res = await api.post("/customers", data);
  return res.data;
};

export const updateCustomer = async (id, data) => {
  const res = await api.put(`/customers/${id}`, data);
  return res.data;
};

export const deleteCustomer = async (id) => {
  const res = await api.delete(`/customers/${id}`);
  return res.data;
};

export const getCustomerDetails = async (id) => {
  const res = await api.get(
    `/customers/${id}/details`
  );

  return res.data;
};