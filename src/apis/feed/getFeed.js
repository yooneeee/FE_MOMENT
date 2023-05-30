import { instance } from "../axios";

const getFeed = async () => {
  try {
    const { data } = await instance.get("/feeds");
    console.log(data.photoList);
    return data.photoList;
  } catch (error) {
    alert(error);
    throw error;
  }
};

export { getFeed };
