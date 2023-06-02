const UserDataComponent = () => {
  const storedUserData = sessionStorage.getItem("persist:root");
  const parsedUserData = JSON.parse(storedUserData);

  const nickName =
    parsedUserData.user && JSON.parse(parsedUserData.user).nickName;

  const role = parsedUserData && JSON.parse(parsedUserData.user).role;

  const profileImg =
    parsedUserData && JSON.parse(parsedUserData.user).profileImg;

  // 유저 데이터만을 반환합니다.
  return {
    nickName,
    role,
    profileImg,
  };
};

export default UserDataComponent;
