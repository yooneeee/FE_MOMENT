import { instance } from "../axios";

const Chatting = async (receiverId) => {
  try {
    const { data } = await instance.get(`/chatRoom/enter/${receiverId}`);
    console.log("챗데이터", data);
    return data;
  } catch (error) {
    throw error;
  }
};

export { Chatting };
