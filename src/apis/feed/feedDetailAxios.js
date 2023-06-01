import { instance } from "../axios";

const feedDetailAxios = async (photoId) => {
  try {
    const { data } = await instance.get(`/feeds/${photoId}`);
    console.log(data);
    return data;
  } catch (error) {
    throw error;
  }
};

export { feedDetailAxios };
