import { instance } from "../axios";

const heartAxios = async (photoId) => {
  try {
    const response = await instance.post(`/feeds/love/${photoId}`);
    console.log(response);
    return response;
  } catch (error) {
    throw error;
  }
};

export default heartAxios;
