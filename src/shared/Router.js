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
          <Route path="feeds" element={<Feed />} />
          <Route path="board" element={<Board />} />
          <Route path="feeddetail" element={<FeedDetail />} />
          <Route path="mypage" element={<MyPage />} />
          <Route path="mypageinformation" element={<MyPageInformation />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
};

export default Router;
