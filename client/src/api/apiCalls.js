import axiosInstance from "../config/axios";

const auth = {
  login: async (email, password) => {
    return axiosInstance.post("/auth/login", { email, password });
  },

  verifyMfa: async (userId, code) => {
    return axiosInstance.post("/auth/verify-mfa", { userId, code });
  },

  getMe: async () => {
    return axiosInstance.get("/auth/me");
  },

  setupMfa: async () => {
    return axiosInstance.post("/auth/setup-mfa");
  },

  disableMfa: async (code) => {
    return axiosInstance.post("/auth/disable-mfa", { code });
  },

  logout: async () => {
    return axiosInstance.post("/auth/logout");
  },
};

const user = {
  updateProfile: async (userId, profileData) => {
    return axiosInstance.put(`/users/${userId}`, profileData);
  },

  getProfile: async (userId) => {
    return axiosInstance.get(`/users/${userId}`);
  },

  updatePassword: async (currentPassword, newPassword) => {
    return axiosInstance.put("/users/update-password", {
      currentPassword,
      newPassword,
    });
  },
};

const api = {
  auth,
  user,
};

export default api;
