import { instance } from "../axios";

const feedLikeListAxios = async (photoId) => {
  try {
    const { data } = await instance.get(`/feeds/love-check/${photoId}`);
    return data;
  } catch (error) {
    throw error;
  }
};

export { feedLikeListAxios };
