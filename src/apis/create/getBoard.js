import { instance } from "../axios";

const getBoard = async () => {
  try {
    const { data } = await instance.get("/boards");

    return data.modelBoard.content;
  } catch (error) {
    throw error;
  }
};

export { getBoard };
