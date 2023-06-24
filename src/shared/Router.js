import React, { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./Layout";
import ScrollToTop from "../components/ScrollToTop";
import LoadingSpinner from "../components/LoadingSpinner";
const Start = lazy(() => import("../pages/Start"));
const Main = lazy(() => import("../pages/Main"));
const Login = lazy(() => import("../pages/Login/Login"));
const KakaoLoginRedirect = lazy(() =>
  import("../pages/Login/KakaoLoginRedirect")
);
const IntegratedSignup = lazy(() => import("../pages/IntegratedSignup"));
const EmailSignup = lazy(() => import("../pages/EmailSignup"));
const Feed = lazy(() => import("../pages/Feed"));
const Board = lazy(() => import("../pages/Board"));
const MyPage = lazy(() => import("../pages/MyPage"));
const MyPageInformation = lazy(() => import("../pages/MyPageInformation"));
const MyPageFeed = lazy(() => import("../pages/MyPageFeed"));
const MyPageBoard = lazy(() => import("../pages/MyPageBoard"));
const BoardDetail = lazy(() => import("../pages/BoardDetail"));
const ChatTest = lazy(() => import("../pages/ChatTest"));
const ChatRoomList = lazy(() => import("../pages/ChatRoomList"));
const Matching = lazy(() => import("../pages/Matching"));

const Router = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Layout>
        <Routes>
          <Route
            path="/"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <Start />
              </Suspense>
            }
          />
          <Route
            path="main"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <Main />
              </Suspense>
            }
          />
          <Route
            path="login"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <Login />
              </Suspense>
            }
          />
          <Route
            path="/users/kakao"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <KakaoLoginRedirect />
              </Suspense>
            }
          />
          <Route
            path="integratedsignup"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <IntegratedSignup />
              </Suspense>
            }
          />
          <Route
            path="emailsignup"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <EmailSignup />
              </Suspense>
            }
          />
          <Route
            path="feeds"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <Feed />
              </Suspense>
            }
          />
          <Route
            path="board"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <Board />
              </Suspense>
            }
          />
          <Route
            path={`page/:hostId`}
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <MyPage />
              </Suspense>
            }
          />
          <Route
            path={`mypageinformation/:hostId`}
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <MyPageInformation />
              </Suspense>
            }
          />
          <Route
            path={`mypagefeed/:hostId`}
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <MyPageFeed />
              </Suspense>
            }
          />
          <Route
            path={`mypageboard/:hostId`}
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <MyPageBoard />
              </Suspense>
            }
          />
          <Route
            path={`board/:boardId`}
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <BoardDetail />
              </Suspense>
            }
          />
          <Route
            path={`chattest/:receiverId`}
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <ChatTest />
              </Suspense>
            }
          />
          <Route
            path={`chatroomlist/:hostId`}
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <ChatRoomList />
              </Suspense>
            }
          />
          <Route
            path={`matching/:hostId`}
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <Matching />
              </Suspense>
            }
          />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
};

export default Router;
