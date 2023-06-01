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

export default authKakaoLogin;
