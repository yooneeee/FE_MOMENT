import { instance } from "../axios";

const AcceptMatching = async ({ boardId, applyUserId }) => {
  console.log(boardId);
  console.log(applyUserId);
  try {
    const { data } = await instance.post(
      `/match/accept/${boardId}/${applyUserId}`
    );
    return data;
  } catch (error) {
    throw error;
  }
};

export default AcceptMatching;
