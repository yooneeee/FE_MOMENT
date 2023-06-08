import { instance } from "../axios";

const createFeedAxios = async (formData) => {
  const config = {
    headers: {
      "content-type": "multipart/form-data",
    },
  };
  try {
    const response = await instance.post(`/feeds/upload`, formData, config);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export { createFeedAxios };
