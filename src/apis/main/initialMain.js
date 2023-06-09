import { instance } from "../axios";

const initialMain = async () => {
  try {
    const { data } = await instance.get("/main");
    return data.photoList;
  } catch (error) {
    throw error;
  }
};

export { initialMain };
