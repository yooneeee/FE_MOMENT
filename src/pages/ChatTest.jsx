import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import * as StompJs from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useQuery } from "react-query";
import { Chatting } from "../apis/mypage/chatting";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import MyPageTabs from "../components/MyPageTabs";

function ChatTest() {
  const { receiverId } = useParams();
  const { hostId } = useParams();
  const { userId, nickName, profileImg } = useSelector((state) => state.user);
  console.log("받는사람아이디", receiverId);
  //   console.log("호스트아이디", hostId);
  console.log("유저아이디", userId);
  console.log("유저닉네임", nickName);
  console.log("유저프로필", profileImg);

  const [stompClient, setStompClient] = useState(null);
  const [message, setMessage] = useState("");
  const [chatList, setChatList] = useState([]);
  // const [chatData, setChatData] = useState({ chatRoomId: null });

  const scrollRef = useRef(null);
  const client = useRef(null);
  //   const prevSenderId = null

  const { isError, isLoading, data } = useQuery(["Chatting", receiverId], () =>
    Chatting(receiverId)
  );
  console.log("채팅할사람", data);

  useEffect(() => {
    if (data?.chatList) {
      setChatList(data.chatList);
    }
  }, [data]);

  console.log("챗리스트:::", data?.chatList);

  /* STOMP 클라이언트 초기화 */
  // useEffect(() => {
  //   connect();
  //   // 컴포넌트 언마운트 시 STOMP 연결 해제
  //   return () => {
  //     disconnect();
  //   };
  // }, []);

  /* 스크롤 */
  useEffect(() => {
    if (scrollRef.current) {
      const chatContainer = scrollRef.current;
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, []);

  useEffect(() => {
    if (data && data.chatRoomId) {
      connect();
      // 컴포넌트 언마운트 시 STOMP 연결 해제
      return () => {
        disconnect();
      };
    }
  }, [data]);

  if (isLoading) {
    return <h1>로딩 중입니다(oﾟvﾟ)ノ</h1>;
  }

  if (isError) {
    console.log("오류", isError);
    return <h1>오류(⊙ˍ⊙)</h1>;
  }

  /* STOMP 연결 */
  const connect = () => {
    const socket = new SockJS(`${process.env.REACT_APP_SERVER_URL}/ws-edit`);
    const stomp = StompJs.Stomp.over(socket);
    stomp.connect({}, () => {
      console.log("웹소켓 연결");
      setStompClient(stomp);
      subscribe(stomp);
    });
    client.current = stomp;
  };

  /* STOMP 연결 해제 */
  const disconnect = () => {
    if (stompClient) {
      stompClient?.disconnect();
      console.log("웹소켓 연결 해제");
    }
  };

  // STOMP 메시지 수신 이벤트 핸들링 -> 웹소켓
  // useEffect(() => {
  //   subscribe();
  // }, [stompClient]);

  /* STOMP 메시지 수신 이벤트 핸들링
  sub 채팅방 입장 */
  const subscribe = () => {
    // if (!stompClient || !data.chatRoomId) return;

    stompClient?.subscribe(`/sub/chat/room/${data.chatRoomId}`, (message) => {
      console.log("변경 전", message);
      const chatMessage = JSON.parse(message.body);
      console.log("챗룸 ID", data.chatRoomId);
      setChatList((prevChatList) => [...prevChatList, chatMessage]);
      console.log("메세지 바디", chatMessage);
      console.log("변경 후", message);
    });
  };

  /*  STOMP 메시지 송신
    pub 메세지 보내기 */
  const sendMessage = () => {
    if (stompClient && message) {
      const chatMessage = {
        message: message,
        senderId: userId,
        receiverId: receiverId,
        chatRoomId: data.chatRoomId,
      };
      stompClient.send("/pub/chat/send", {}, JSON.stringify(chatMessage));
      console.log("챗", chatMessage);
      setChatList((prevChatList) => [...prevChatList, chatMessage]);

      // 스크롤
      // if (scrollRef.current) {
      //   scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      // }

      setMessage("");
    }
  };
  const enterHandler = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    /* 채팅방이 존재 */
    <>
      {/* <MyPageTabs /> */}
      <ChatContainer ref={scrollRef}>
        {chatList.map((chat) => (
          <React.Fragment key={chat.id}>
            <ReceiverProfile
              isSender={chat.senderId === userId}
              src={
                chat.senderId === userId ? profileImg : data.receiverProfileImg
              }
              alt="Profile"
            />
            <Nickname isSender={chat.senderId === userId}>
              {chat.senderId === userId ? nickName : data.receiverNickName}
            </Nickname>
            <ChatBubble
              key={chat.id}
              isSender={chat.senderId === userId}
              isReceiver={chat.receiverId === userId}
            >
              {chat.message}
            </ChatBubble>
          </React.Fragment>
        ))}
      </ChatContainer>
      <SendContainer>
        <ChatInputContainer>
          <ChatInput
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => enterHandler(e)}
          />
          <SendButton onClick={sendMessage}>전송</SendButton>
        </ChatInputContainer>
      </SendContainer>
    </>
  );
}

export default ChatTest;

const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  max-width: 800px;
  align-items: center;
  margin: 20px auto;

  position: relative;
  min-height: 70vh;
  /* overflow-y: auto; */
`;

const SendContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 800px;
  margin: 10px auto 0;

  /* position: relative; */
`;

const ReceiverProfile = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 40%;
  align-self: ${(props) => (props.isSender ? "flex-end" : "flex-start")};
`;

const Nickname = styled.div`
  margin-left: 8px;
  font-size: 15px;
  margin-left: ${(props) => (props.isSender ? "auto" : "8px")};
  margin-right: ${(props) => (props.isSender ? "8px" : "auto")};
`;

const ChatBubble = styled.div`
  background-color: ${(props) =>
    props.isSender ? "#d6c9e9" : props.isReceiver ? "#F3F3F3" : "transparent"};
  padding: 8px;
  margin-top: 4px;
  margin-bottom: 20px;
  border-radius: 8px;
  align-self: ${(props) => (props.isSender ? "flex-end" : "flex-start")};
`;

const ChatInputContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 16px;

  /* position: absolute; */
  /* bottom: 20px; */
  /* left: 50%; */
  /* transform: translateX(-50%); */
`;

const ChatInput = styled.input`
  flex: 1;
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const SendButton = styled.button`
  margin-left: 8px;
  padding: 8px 30px;
  background-color: #483767;
  color: #fff;
  border: none;
  border-radius: 4px;
`;
