import { instance } from "../axios";

/* 마이페이지 */
const mypage = async (hostId) => {
  try {
    const { data } = await instance.get(`/page/${hostId}`);
    console.log(data);
    return data;
  } catch (error) {
    throw error;
  }
};

/* 마이페이지 정보 수정 */
const mypageInformationAxios = async ({ hostId, formData }) => {
  const config = {
    headers: {
      "Content-type": "multipart/form-data",
    },
  };
  // console.log(hostId);
  // console.log(formData);

  try {
    const response = await instance.put(`/page/${hostId}`, formData, config);
    return response.data;
  } catch (error) {
    throw error.response;
  }
};

/* 마이페이지 피드 삭제 */
const mypageFeedDelete = async (photoId) => {
  try {
    const response = await instance.delete(`/page/${photoId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export { mypage, mypageInformationAxios, mypageFeedDelete };
