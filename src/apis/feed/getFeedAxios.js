import { instance } from "../axios";

const getFeedAxios = async ({ pageParam = 0 }) => {
  try {
    const { data } = await instance.get(`/feeds?page=${pageParam}&size=`);
    return data;
  } catch (error) {
    throw error;
  }
};

export { getFeedAxios };
