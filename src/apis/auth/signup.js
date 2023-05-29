import { instance } from "../axios";
// 회원가입API, method : post, url : /users/signup
const signupAxios = async (formData) => {
  const config = {
    headers: {
      "content-type": "multipart/form-data",
    },
  };
  try {
    const response = await instance.post(`/users/signup`, formData, config);
    return response.data;
  } catch (error) {
    alert(error);
    throw error;
  }
};
// 이메일 인증코드 보내기API, method: post, url: /emails/auth
const sendEmailAxios = async (email) => {
  try {
    const response = await instance.post("/emails/auth", email);
    console.log(response);
    return response.data;
  } catch (error) {
    alert(error);
    throw error;
  }
};
// 이메일 인증코드 확인API, method: post, url: /emails/check
const checkEmailAxios = async ({ email, code }) => {
  try {
    const response = await instance.post("/emails/check", { email, code });
    return response.data;
  } catch (error) {
    alert(error);
    throw error;
  }
};

export { signupAxios, sendEmailAxios, checkEmailAxios };
