import { instance } from "../axios";

const feedDetail = async (photoId) => {
  try {
    const { data } = await instance.get(`/feeds/${photoId}`);
    console.log(data);
    return data;
  } catch (error) {
    alert(error);
    throw error;
  }
};

export { feedDetail };
