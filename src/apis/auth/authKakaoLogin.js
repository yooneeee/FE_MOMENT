import { instance } from "../axios";

const authKakaoLogin = async (code) => {
  try {
    const { data } = await instance.get(`/users/kakao?code=${code}`);
    console.log(data);
    return data.message;
  } catch (error) {
    throw new Error(error);
  }
};

export default authKakaoLogin;
