import { instance } from "../axios";

const getBoard = async () => {
  try {
    const { data } = await instance.get("/boards");
    console.log(data.content);
    return data.modelboard.content;
  } catch (error) {
    throw error;
  }
};

export { getBoard };
