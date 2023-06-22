import axios from "axios";
import CryptoJS from "crypto-js";

export function encrypt(data) {
  const secretKey = `${process.env.REACT_APP_SECRETKEY}`;
  return CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString();
}

export function decrypt(data) {
  const secretKey = `${process.env.REACT_APP_SECRETKEY}`;
  const bytes = CryptoJS.AES.decrypt(data, secretKey);
  const decryptedString = bytes.toString(CryptoJS.enc.Utf8);

  // // 디코딩된 문자열을 JSON.parse()에 전달하여 파싱
  const parsedData = JSON.parse(decryptedString);

  return parsedData;
}
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

    if (Refresh_key) {
      const decryptRefreshKey = decrypt(Refresh_key);

      config.headers = {
        ...config.headers,
        Access_key,
        Refresh_key: decryptRefreshKey,
      };
      return config;
    }
    if (Access_key || Refresh_key) {
      config.headers = {
        ...config.headers,
        Access_key,
        Refresh_key,
      };
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(function (response) {
  const accessKeyHeader =
    response.headers.get("Access_key") || response.headers.get("access_key");
  const refreshKeyHeader =
    response.headers.get("Refresh_key") || response.headers.get("refresh_key");

  if (accessKeyHeader) {
    sessionStorage.setItem("Access_key", accessKeyHeader);
  }
  if (refreshKeyHeader) {
    const encryptRefreshKey = encrypt(refreshKeyHeader);
    sessionStorage.setItem("Refresh_key", encryptRefreshKey);
  }
  return response;
});

export { instance };
