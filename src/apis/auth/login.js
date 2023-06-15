import { instance } from "../axios";

const loginAxios = async ({ email, password }) => {
  try {
    const response = await instance.post("/users/login", { email, password });
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

const logoutAxios = async () => {
  try {
    const response = await instance.get("/users/logout");
    return response.data;
  } catch (error) {
    return Promise.reject(error.response.data.message);
  }
};

const deleteUserAxios = async () => {
  try {
    const response = await instance.delete(`/users/hard`);
    return response;
  } catch (error) {
    alert(error);
    console.log(error);
  }
};

export { loginAxios, logoutAxios, deleteUserAxios };
