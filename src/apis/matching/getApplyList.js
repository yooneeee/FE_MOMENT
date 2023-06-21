import { instance } from "../axios";

const getApplyList = async () => {
  try {
    const { data } = await instance.get("/match/apply-list");
    return data;
  } catch (error) {
    throw error;
  }
};

export default getApplyList;
