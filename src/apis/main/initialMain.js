import { instance } from "../axios";

const initialMain = async () => {
  try {
    const { data } = await instance.get("/main");
    console.log(data);
    return data.photoList;
  } catch (error) {
    alert(error);
    throw error;
  }
};

export { initialMain };
