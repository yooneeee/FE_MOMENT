import { instance } from "../axios";

const Chatting = async (userId) => {
  try {
    const { data } = await instance.get(`/chatRoom/enter/${userId}`);
    console.log(data);
    // return data
  } catch (error) {
    alert(error);
    throw error;
  }
};

export { Chatting };
