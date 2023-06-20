import { instance } from "../axios";

const searchFeedAxios = async ({ keyword, option, role }) => {
  try {
    const response = await instance.get(
      `/feeds/search?${option}=${keyword}&role=${role}`
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export { searchFeedAxios };
