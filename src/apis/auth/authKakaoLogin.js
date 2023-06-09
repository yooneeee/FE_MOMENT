import { instance } from "../axios";

const authKakaoLogin = async (code) => {
  try {
    const response = await instance.get(`/users/kakao?code=${code}`);
    return response;
  } catch (error) {
    throw error;
  }
};

const sendRoleAxios = async (role) => {
  try {
    const response = await instance.post(`/users/kakao/role?role=${role}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export { authKakaoLogin, sendRoleAxios };
