import { instance } from "../axios";

const authKakaoLogin = async (code) => {
  try {
    const { data } = await instance.get(`/oauth/kakao?code=${code}`);
    return data.message;
  } catch (error) {
    throw new Error(error);
  }
};

export default authKakaoLogin;
