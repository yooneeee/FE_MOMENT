import { instance } from "../axios";

const getBoard = async ({ pageParam = 0, activeNavItem }) => {
  try {
    const { data } = await instance.get(`/boards?page=${pageParam}&size=`);
    if (activeNavItem === "Model") {
      return data.modelBoard;
    } else if (activeNavItem === "Photographer") {
      return data.photographerBoard;
    }
  } catch (error) {
    throw error;
  }
};

export { getBoard };
