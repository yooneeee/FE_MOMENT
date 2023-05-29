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
    const Access_key = sessionStorage.getItem("Access_key");
    const Refresh_key = sessionStorage.getItem("Refresh_key");

    if (Access_key && Refresh_key) {
      config.headers["Access_key"] = Access_key;
      config.headers["Refresh_key"] = Refresh_key;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(function (response) {
  sessionStorage.setItem("Access_key", response.headers.get("Access_key"));
  sessionStorage.setItem("Refresh_key", response.headers.get("Refresh_key"));

  return response;
});
export { instance };
