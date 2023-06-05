import { instance } from "../axios";

const getBoardDetailAxios = async (boardId) => {
  try {
    const { data } = await instance.get(`/boards/${boardId}`);
    return data;
  } catch (error) {
    throw error;
  }
};

export { getBoardDetailAxios };
