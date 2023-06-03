import { instance } from "../axios";

const main = async () => {
  try {
    const { data } = await instance.get("/home");
    console.log(data);
    return data.eachRoleUsersList;
  } catch (error) {
    throw error;
  }
};

export { main };
