import React from "react";
import styled from "styled-components";
import MyPageTabs from "../components/MyPageTabs";
import { ChattingList } from "../apis/mypage/chatting";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";

function ChatList() {
  const { isError, isLoading, data } = useQuery("ChattingList", ChattingList);
  console.log("채팅목록", data);
  //   console.log("마지막채팅", data.lastChat);

  if (isLoading) {
    // return <h1>로딩 중입니다(oﾟvﾟ)ノ</h1>;
    return <LoadingSpinner />;
  }

  if (isError) {
    console.log("오류", isError);
    return <h1>오류(⊙ˍ⊙)</h1>;
  }

  return (
    <>
      <MyPageTabs pageName={"채팅목록"} />
      <ChatListContainer>
        <div>전체 채팅</div>
        {data.map((item) => (
          <Link to={`/chattest/${item.receiverId}`} key={item.chatRoomId}>
            <List>
              <ChatItem>
                <ProfileImage
                  src={item.receiverProfileImg}
                  alt="profile image"
                />
                <Content>
                  <SenderName>{item.receiverNickName}</SenderName>
                  {item.lastChat && <Message>{item.lastChat.message}</Message>}
                </Content>
              </ChatItem>
            </List>
          </Link>
        ))}
      </ChatListContainer>
    </>
  );
}

export default ChatList;

const ChatListContainer = styled.div`
  width: 100%;
  display: flex;
  /* height: ; */
  padding: 0px 100px;
  margin-top: 20px;
  flex-direction: column;
`;

const List = styled.div`
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 16px;
  width: 30%;
`;

const ChatItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 16px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const ProfileImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
`;

const Content = styled.div`
  margin-left: 12px;
`;

const SenderName = styled.span`
  font-weight: bold;
  margin-right: 20px;
`;

const Message = styled.span`
  color: #555;
`;
