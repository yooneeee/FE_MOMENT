import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoggedIn: false,
  nickName: "",
  profileImg: "",
  role: "",
  userId: "",
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginSuccess: (state) => {
      state.isLoggedIn = true;
    },
    logoutSuccess: (state) => {
      state.isLoggedIn = false;
      state.nickName = "";
      state.profileImg = "";
      state.role = "";
      state.userId = "";
    },
    setUser: (state, action) => {
      const { nickName, profileImg, role, userId } = action.payload;
      if (nickName) {
        state.nickName = nickName;
      }
      if (profileImg) {
        state.profileImg = profileImg;
      }
      if (role) {
        state.role = role;
      }
      if (userId) {
        state.userId = action.payload.userId;
      }
    },
    /*     setUser: (state, action) => {
      state.nickName = action.payload.nickName;
      state.profileImg = action.payload.profileImg;
      state.role = action.payload.role;
      state.userId = action.payload.userId;
    }, */
    setUserRole: (state, action) => {
      state.role = action.payload.role;
    },
    /*     changeUserInfo:(state,action)=>{
      if(action.payload.nickName)
    } */
  },
});

export const { loginSuccess, logoutSuccess, setUser, setUserRole } =
  userSlice.actions;
export default userSlice.reducer;
