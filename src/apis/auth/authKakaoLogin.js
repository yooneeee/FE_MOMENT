import { instance } from "../axios";

const authKakaoLogin = async (code) => {
  try {
    const response = await instance.get(`/users/kakao?code=${code}`);
    console.log("response", response);
    return response;
  } catch (error) {
    console.log(error);
  }
};

const sendRoleAxios = async (role) => {
  console.log("role", role);
  try {
    const response = await instance.post(`/users/kakao/role?role=${role}`);
    console.log("response", response);
    return response.data;
  } catch (error) {
    alert(error);
    throw error;
  }
};

export { authKakaoLogin, sendRoleAxios };
