import { instance } from "../axios";

/* 채팅페이지 */
const Chatting = async (receiverId) => {
  try {
    const { data } = await instance.get(`/chatRoom/enter/${receiverId}`);
    console.log("챗데이터", data);
    return data;
  } catch (error) {
    throw error;
  }
};

/* 채팅목록 페이지 */
const Chatlist = async () => {
  try {
    const { data } = await instance.get(`/chatRoom/list`);
    return data;
  } catch (error) {
    throw error;
  }
};

export { Chatting, Chatlist };
