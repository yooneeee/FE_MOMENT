import { instance } from "../axios";

const createFeedAxios = async (formData) => {
  const config = {
    headers: {
      "content-type": "multipart/form-data",
    },
  };
  try {
    const response = await instance.post(`/feeds`, formData, config);
    return response.data;
  } catch (error) {
    alert(error);
    throw error;
  }
};

export { createFeedAxios };
