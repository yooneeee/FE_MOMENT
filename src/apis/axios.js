import axios from "axios";

const instance = axios.create({
  baseURL: process.env.REACT_APP_SERVER_URL,
  withCredentials: true,
  headers: {
    "Access-Control-Allow-Origin": "*",
  },
});

instance.interceptors.request.use(
  (config) => {
    if (config.headers === undefined) return config;
    const Access_key = localStorage.getItem("Access_key");
    const Refresh_key = localStorage.getItem("Refresh_key");

    if (Access_key || Refresh_key) {
      config.headers["Access_key"] = Access_key;
      config.headers["Refresh_key"] = Refresh_key;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  function (response) {
    const accessKeyHeader = response.headers.get("Access_key");
    const refreshKeyHeader = response.headers.get("Refresh_key");

    if (accessKeyHeader && refreshKeyHeader) {
      sessionStorage.setItem("Access_key", accessKeyHeader);
      sessionStorage.setItem("Refresh_key", refreshKeyHeader);
    }
    return response;
  },
  function (error) {
    return Promise.reject(error);
  }
);

export { instance };
