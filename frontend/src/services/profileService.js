import api from "./api";

// ==========================================
// Get Owner Profile
// ==========================================
export const getProfile = async () => {
  const res = await api.get("/user/profile");
  return res.data;
};

// ==========================================
// Update Owner Profile
// ==========================================
export const updateProfile = async (data) => {
  const res = await api.put("/user/profile", data);
  return res.data;
};

// ==========================================
// Change Password
// ==========================================
export const changePassword = async (data) => {
  const res = await api.put("/user/change-password", data);
  return res.data;
};