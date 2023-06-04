import { instance } from "../axios";

const getBoardDetailAxios = async (boardId) => {
  try {
    const { data } = await instance.get(`/feeds/${boardId}`);
    return data;
  } catch (error) {
    throw error;
  }
};

export { getBoardDetailAxios };
