import { instance } from "../axios";

const deleteUser = async ({ boardId, applyUserId }) => {
  try {
    const { data } = await instance.put(
      `/match/delete/${boardId}/${applyUserId}`
    );
    return data;
  } catch (error) {
    throw error;
  }
};

export default deleteUser;
