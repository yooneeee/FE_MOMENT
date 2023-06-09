import { instance } from "../axios";

const feedDetailAxios = async (photoId) => {
  try {
    const { data } = await instance.get(`/feeds/${photoId}`);
    return data;
  } catch (error) {
    throw error;
  }
};

export { feedDetailAxios };
