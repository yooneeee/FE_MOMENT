import { instance } from "../axios";

const getFeed = async () => {
  try {
    const { data } = await instance.get("/feeds");
    return data.photoList;
  } catch (error) {
    alert(error);
    throw error;
  }
};

export { getFeed };
