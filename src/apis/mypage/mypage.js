import { instance } from "../axios";

const mypage = async (hostId) => {
  try {
    const { data } = await instance.get(`/page/${hostId}`);
    console.log(data);
    return data;
  } catch (error) {
    alert(error);
    throw error;
  }
};

// const mypageIngormationAxios = async (photoId, formData) => {
//   const config = {
//     headers: {
//       "Content-type": "multipart/form-data",
//     },
//   };
//   try {
//     const response = await instance.put(`/page/${photoId}`, formData, config);
//     return response.data;
//   } catch (error) {
//     alert(error);
//     throw error;
//   }
// };

export { mypage };
