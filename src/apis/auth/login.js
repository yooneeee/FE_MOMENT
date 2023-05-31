import { instance } from "../axios";

const loginAxios = async ({ email, password }) => {
  try {
    const response = await instance.post("/users/login", { email, password });
    return response.data;
  } catch (error) {
    return Promise.reject(error.response.data.message);
  }
};

const logoutAxios = async () => {
  try {
    const response = await instance.get("/users/logout");
    return response.data;
  } catch (error) {
    alert(error);
    return Promise.reject(error.response.data.message);
  }
};

export { loginAxios, logoutAxios };
