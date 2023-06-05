import { instance } from "../axios";

const getBoard = async (role) => {
  try {
    const { data } = await instance.get("/boards");
    console.log(data);
    if (role === "Model") {
      return data.modelBoard.content;
    } else if (role === "Photographer") {
      return data.photographerBoard.content;
    }
  } catch (error) {
    throw error;
  }
};

export { getBoard };
