import { instance } from "../axios";

const main = async () => {
  try {
    const { data } = await instance.get("/home");

    return data;
  } catch (error) {
    console.log(error);
  }
};

export { main };
