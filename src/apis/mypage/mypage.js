import { instance } from "../axios";

// const mypageAxios = async (hostId, formData) => {
//   const config = {
//     headers: {
//       "Content-type": "multipart/form-data",
//     },
//   };
//   try {
//     const response = await instance.get(`/page/${hostId}`, formData, config);
//     return response.data;
//   } catch (error) {
//     alert(error);
//     throw error;
//   }
// };

const mypageIngormationAxios = async (photoId, formData) => {
  const config = {
    headers: {
      "Content-type": "multipart/form-data",
    },
  };
  try {
    const response = await instance.put(`/page/${photoId}`, formData, config);
    return response.data;
  } catch (error) {
    alert(error);
    throw error;
  }
};

export { mypageIngormationAxios };
