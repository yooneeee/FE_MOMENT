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
      state.nickName = action.payload.nickName;
      state.profileImg = action.payload.profileImg;
      state.role = action.payload.role;
      state.userId = action.payload.userId;
    },
  },
});

export const { loginSuccess, logoutSuccess, setUser } = userSlice.actions;
export default userSlice.reducer;
