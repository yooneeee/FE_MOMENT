import React from "react";
import styled from "styled-components";
import { useQuery } from "react-query";
import { Chatting } from "../apis/mypage/chatting";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

function ChatTest() {
  const { receiverId } = useParams();
  const { hostId } = useParams();
  //   const { userId } = useSelector((state) => state.user);
  console.log("유저아이디", receiverId);

  //   if (!userId) {
  //     return <h1>사용자 ID가 없습니다.</h1>;
  //   }
  const { isError, isLoading, data } = useQuery(["Chatting", Chatting], () =>
    Chatting(hostId)
  );
  console.log("데이터", data);

  if (isLoading) {
    return <h1>로딩 중입니다(oﾟvﾟ)ノ</h1>;
  }

  if (isError) {
    console.log("오류", isError);
    return <h1>오류(⊙ˍ⊙)</h1>;
  }

  if (!data.chatRoomId) {
    // 채팅방이 없는 경우
    return (
      <ChatContainer>
        <ReceiverProfile src={data.receiverProfileImg} alt="Receiver Profile" />
        <ReceiverInfo>
          <p>Receiver ID: {data.receiverId}</p>
          <p>Receiver Nickname: {data.receiverNickName}</p>
          <p>No chat room available</p>
        </ReceiverInfo>
      </ChatContainer>
    );
  }
  return (
    <ChatContainer>
      <p>Chat Room ID: {data.chatRoomId}</p>
      {data.chatList.map((chat) => (
        <ChatMessage key={chat.id}>{chat.message}</ChatMessage>
      ))}
      <ReceiverProfile src={data.receiverProfileImg} alt="Receiver Profile" />
      <ReceiverInfo>
        <p>Receiver ID: {data.receiverId}</p>
        <p>Receiver Nickname: {data.receiverNickName}</p>
      </ReceiverInfo>
    </ChatContainer>
  );
}

export default ChatTest;

const ChatContainer = styled.div`
  /* 스타일 컨테이너에 원하는 스타일을 적용하세요 */
`;

const ChatMessage = styled.p`
  /* 채팅 메시지에 대한 스타일을 적용하세요 */
`;

const ReceiverProfile = styled.img`
  /* 수신자 프로필 이미지에 대한 스타일을 적용하세요 */
`;

const ReceiverInfo = styled.div`
  /* 수신자 정보에 대한 스타일을 적용하세요 */
`;
