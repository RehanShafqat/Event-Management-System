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

const api = {
  auth,
};

export default api;
