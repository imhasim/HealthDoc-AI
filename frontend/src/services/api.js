import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
});


// ===============================
// Request Interceptor
// ===============================

api.interceptors.request.use(
  (config) => {

    const token = localStorage.getItem("access_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },

  (error) => {
    return Promise.reject(error);
  }
);


// ===============================
// Response Interceptor
// ===============================

api.interceptors.response.use(
  (response) => {
    return response;
  },

  (error) => {

    // -------------------------------
    // 401 - Unauthorized
    // -------------------------------

    if (error.response?.status === 401) {

      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");

      window.location.href = "/login";
    }


    // -------------------------------
    // 400 - Bad Request
    // -------------------------------

    if (error.response?.status === 400) {

      console.log("Bad Request:", error.response.data);
    }


    // -------------------------------
    // 404 - Not Found
    // -------------------------------

    if (error.response?.status === 404) {

      console.log("Not Found:", error.response.data);
    }


    // -------------------------------
    // 500 - Server Error
    // -------------------------------

    if (error.response?.status === 500) {

      console.log("Server Error:", error.response.data);
    }


    // -------------------------------
    // Network Error
    // -------------------------------

    if (!error.response) {

      console.log("Network Error: Backend server may be down.");
    }


    return Promise.reject(error);
  }
);


export default api;

