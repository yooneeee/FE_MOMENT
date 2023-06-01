import { instance } from "../axios";

const getFeedAxios = async () => {
  try {
    const { data } = await instance.get("/feeds");
    return data.photoList;
  } catch (error) {
    throw error;
  }
};

export { getFeedAxios };
