import { instance } from "../axios";

const unreadChatAxios = async () => {
  try {
    const response = await instance.get("/chat/unread");
    return response.data;
  } catch (error) {
    return Promise.reject(error.response.data.message);
  }
};
export { unreadChatAxios };
