import api from "./api";

export const getStatement = async (customerId) => {
  const res = await api.get(`/statement/customer/${customerId}`);
  return res.data;
};
