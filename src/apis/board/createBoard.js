import { instance } from "../axios";

const createBoardAxios = async (formData) => {
  const config = {
    headers: {
      "content-type": "multipart/form-data",
    },
  };
  try {
    const response = await instance.post("/boards", formData, config);
    return response.data;
  } catch (error) {
    alert(error);
    throw error;
  }
};

export { createBoardAxios };
