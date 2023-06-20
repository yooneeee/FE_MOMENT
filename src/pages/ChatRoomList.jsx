import React from "react";
import styled from "styled-components";
import MyPageTabs from "../components/MyPageTabs";
import ChatList from "./ChatList";
import { createGlobalStyle } from "styled-components";

function ChatRoomList() {
  return (
    <>
      <GlobalStyle />
      <MyPageTabs pageName={"채팅목록"} />
      <ChatListContainer>
        <ChatList />
      </ChatListContainer>
    </>
  );
}

export default ChatRoomList;

const GlobalStyle = createGlobalStyle`
  #root {
    overflow: hidden;
    height: 95vh;
  }
`;

const ChatListContainer = styled.div`
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
`;
