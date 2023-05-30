import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Start from "../pages/Start";
import Main from "../pages/Main";
import Login from "../pages/Login";
import Layout from "./Layout";
import Feed from "../pages/Feed";
import Board from "../pages/Board";
import FeedDetail from "../pages/FeedDetail";
import IntegratedSignup from "../pages/IntegratedSignup";
import EmailSignup from "../pages/EmailSignup";
import MyPage from "../pages/MyPage";
import MyPageInformation from "../pages/MyPageInformation";
import Chat from "../pages/Chat";

const Router = () => {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Start />} />
          <Route path="main" element={<Main />} />
          <Route path="login" element={<Login />} />
          <Route path="integratedsignup" element={<IntegratedSignup />} />
          <Route path="emailsignup" element={<EmailSignup />} />
          <Route path="feed" element={<Feed />} />
          <Route path="board" element={<Board />} />
          <Route path="feeddetail" element={<FeedDetail />} />
          <Route path="mypage" element={<MyPage />} />
          <Route path="mypageinformation" element={<MyPageInformation />} />
          <Route path="chat" element={<Chat />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
};

export default Router;
