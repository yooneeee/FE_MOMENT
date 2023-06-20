import { instance } from "../axios";

const requestedMatchingList = async (boardId) => {
  try {
    const { data } = await instance.get(`/match/accept-list/${boardId}`);
    return data;
  } catch (error) {
    throw error;
  }
};

export default requestedMatchingList;
