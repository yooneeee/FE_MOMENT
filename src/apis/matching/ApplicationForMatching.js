import { instance } from "../axios";

const ApplicationForMatching = async (boardId) => {
  console.log(boardId);
  try {
    const { data } = await instance.post(`/match/apply/${boardId}`);
    return data;
  } catch (error) {
    throw error;
  }
};

export default ApplicationForMatching;
