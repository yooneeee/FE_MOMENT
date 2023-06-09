import { instance } from "../axios";

const heartAxios = async (photoId) => {
  try {
    const { data } = await instance.post(`/feeds/love/${photoId}`);
    return data;
  } catch (error) {
    throw error;
  }
};

export default heartAxios;
