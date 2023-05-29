import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLogin: false,
};

export const auth = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.isLogin(true);
    },
    logout: (state) => {
      state.isLogin(false);
    },
  },
});

export const { login, logout } = auth.actions;
export default auth.reducer;
