import { instance } from "../axios";

/* 채팅페이지 */
const Chatting = async (receiverId) => {
  try {
    const { data } = await instance.get(`/chatRoom/enter/${receiverId}`);
    return data;
  } catch (error) {
    throw error;
  }
};

/* 채팅목록 페이지 */
const ChattingList = async () => {
  try {
    const { data } = await instance.get(`/chatRoom/list`);
    return data;
  } catch (error) {
    throw error;
  }
};

/* 채팅방 삭제 */
const ChattingRoomDelete = async (chatRoomId) => {
  try {
    const response = await instance.delete(`/chatRoom/${chatRoomId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export { Chatting, ChattingList, ChattingRoomDelete };
