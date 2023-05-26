import { instance } from "../axios";
// 회원가입API, method : post, url : /users/signup
const signup = async (newUser) => {
  try {
    const response = await instance.post(`/users/signup`, newUser);
    console.log(response);
    return response.data;
  } catch (error) {
    console.log(error);
    return Promise.reject(error.response.data.message);
  }
};
export { signup };
