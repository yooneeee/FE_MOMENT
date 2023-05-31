import { instance } from "../axios";

const main = async () => {
  try {
    const { data } = await instance.get("/home");
    return data.eachRoleUsersList;
  } catch (error) {
    alert(error);
    throw error;
  }
};

export { main };
