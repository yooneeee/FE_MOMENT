import { instance } from "../axios";

const loginAxios = async (user) => {
  try {
    const response = await instance.post("/users/login", user);
    return response.data;
  } catch (error) {
    alert(error);
    throw error;
  }
};

export { loginAxios };
