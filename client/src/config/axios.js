import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

//INFO: To keep track of req
axiosInstance.interceptors.request.use((config) => {
  config.meta = {
    requestStartedAt: new Date(),
    requestId: `${config.method?.toUpperCase()} ${config.url}`,
  };
  return config;
});

axiosInstance.interceptors.request.use((config) => {
  console.log("SENDING REQUEST INFO");
  console.log({
    method: config.method,
    url: config.url,
    data: config.data,
    params: config.params,
  });
  return config;
});

//INFO: To keep track of response (which req was responded)
// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    const { requestId, requestStartedAt } = response.config.meta || {};
    const duration = new Date() - requestStartedAt;
    console.log("✅ Response for:", requestId);
    console.log("⏱️ Duration:", duration + "ms");
    console.log("📦 Data:", response.data);
    return response;
  },
  (error) => {
    const { requestId } = error.config?.meta || {};
    console.log("❌ Error response for:", requestId, "ERROR: ", error);
    return Promise.reject(error);
  }
);

export default axiosInstance;
