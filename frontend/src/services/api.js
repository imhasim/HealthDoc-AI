
import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
});

// Token refresh ke liye alag Axios instance
const refreshApi = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
});

let refreshPromise = null;

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/token/refresh/")
    ) {
      const refreshToken = localStorage.getItem("refresh_token");

      if (!refreshToken) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        window.location.href = "/login";
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      try {
        if (!refreshPromise) {
          refreshPromise = refreshApi
            .post("/token/refresh/", {
              refresh: refreshToken,
            })
            .then((response) => {
              const newAccessToken = response.data.access;

              localStorage.setItem("access_token", newAccessToken);

              // Agar backend rotated refresh token de
              if (response.data.refresh) {
                localStorage.setItem(
                  "refresh_token",
                  response.data.refresh
                );
              }

              return newAccessToken;
            })
            .finally(() => {
              refreshPromise = null;
            });
        }

        const newAccessToken = await refreshPromise;

        originalRequest.headers =
          originalRequest.headers || {};

        originalRequest.headers.Authorization =
          `Bearer ${newAccessToken}`;

        // Original request dobara bhejo
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        window.location.href = "/login";

        return Promise.reject(refreshError);
      }
    }

    if (error.response?.status === 400) {
      console.log("Bad Request:", error.response.data);
    }

    if (error.response?.status === 404) {
      console.log("Not Found:", error.response.data);
    }

    if (error.response?.status === 500) {
      console.log("Server Error:", error.response.data);
    }

    if (!error.response) {
      console.log("Network Error: Backend server may be down.");
    }

    return Promise.reject(error);
  }
);

export default api;