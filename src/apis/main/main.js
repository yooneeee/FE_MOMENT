import { instance } from "../axios";

const main = async () => {
  try {
    const { data } = await instance.get("/home");
    return data;
    /*   return data.eachRoleUsersList; */
  } catch (error) {
    /*     alert(error); */
    console.log(error);
  }
};

export { main };
