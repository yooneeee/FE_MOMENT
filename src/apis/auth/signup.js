import { instance } from "../axios";
// 회원가입API, method : post, url : /users/signup
const signupAxios = async (newUser) => {
  try {
    const response = await instance.post(`/users/signup`, newUser);
    console.log(response);
    return response.data;
  } catch (error) {
    const errorMessage = error.response.data.errorMessage;
    alert(errorMessage);
    throw error;
  }
};
// 이메일 인증코드 보내기API, method: post, url: /emails/auth
const sendEmailAxios = async (email) => {
  console.log("이메일", email);
  try {
    const response = await instance.post("/emails/auth", email);
    return response.data;
  } catch (error) {
    const errorMessage = error.response.data.errorMessage;
    alert(errorMessage);
    throw error;
  }
};
// 이메일 인증코드 확인API, method: post, url: /emails/check
const checkEmailAxios = async ({ email, code }) => {
  try {
    const response = await instance.post("/emails/check", { email, code });
    return response.data;
  } catch (error) {
    const errorMessage = error.response.data.errorMessage;
    alert(errorMessage);
    throw error;
  }
};

export { signupAxios, sendEmailAxios, checkEmailAxios };
