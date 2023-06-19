import { instance } from "../axios";

const searchBoardAxios = async ({ keyword, option, role }) => {
  try {
    const response = await instance.get(
      `/boards/search?${option}=${keyword}&role=${role}`
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export { searchBoardAxios };
