import { instance } from "../axios";

const getFeedAxios = async ({ pageParam = 0, activeNavItem }) => {
  console.log(pageParam);
  try {
    const { data } = await instance.get(`/feeds?page=${pageParam}&size=`);
    if (activeNavItem === "Latest") {
      return data.photoList1;
    } else if (activeNavItem === "Popularity") {
      return data.photoList2;
    }
  } catch (error) {
    throw error;
  }
};

export { getFeedAxios };
