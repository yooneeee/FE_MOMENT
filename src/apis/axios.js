import axios from "axios";
import { useNavigate } from "react-router-dom";

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
    const accessKeyHeader =
      response.headers.get("Access_key") || response.headers.get("access_key");
    const refreshKeyHeader =
      response.headers.get("Refresh_key") ||
      response.headers.get("refresh_key");

    if (accessKeyHeader) {
      sessionStorage.setItem("Access_key", accessKeyHeader);
    }
    if (refreshKeyHeader) {
      sessionStorage.setItem("Refresh_key", refreshKeyHeader);
    }
    return response;
  }
  /*  function (error) {
    const errorMessage = error.response.data;
    console.log(errorMessage);
    if (errorMessage === "리프레시 토큰이 없습니다.") {
      sessionStorage.removeItem("Access_key");
      sessionStorage.removeItem("Refresh_key");
      alert("토큰 유효기간이 만료되어 초기 페이지로 이동합니다.");
      window.location.href = "/";
    }
  } */
);

export { instance };
