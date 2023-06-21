import { instance } from "../axios";

const getAcceptList = async () => {
  try {
    const { data } = await instance.get("/match/accept-list");
    return data;
  } catch (error) {
    throw error;
  }
};

export default getAcceptList;
