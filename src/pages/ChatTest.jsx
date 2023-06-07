import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import * as StompJs from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useQuery } from "react-query";
import { Chatting } from "../apis/mypage/chatting";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

function ChatTest() {
  const { receiverId } = useParams();
  const { hostId } = useParams();
  const { userId } = useSelector((state) => state.user);
  console.log("받는사람아이디", receiverId);
  //   console.log("호스트아이디", hostId);
  console.log("유저아이디", userId);

  const [stompClient, setStompClient] = useState(null);
  const [message, setMessage] = useState("");
  const [chatList, setChatList] = useState([]);
  const [chatData, setChatData] = useState({});
  const client = useRef(null);

  /* STOMP 클라이언트 초기화 */
  useEffect(() => {
    connect();
    // 컴포넌트 언마운트 시 STOMP 연결 해제
    return () => {
      disconnect();
    };
  }, []);

  /* STOMP 연결 */
  const connect = () => {
    const socket = new SockJS("http://15.165.14.7/ws-edit");
    const stomp = StompJs.Stomp.over(socket);
    stomp.connect({}, () => {
      console.log("웹소켓 연결");
      setStompClient(stomp);
      subscribe();
    });
    client.current = stomp;
  };

  /* STOMP 연결 해제 */
  const disconnect = () => {
    if (stompClient) {
      stompClient.disconnect();
      console.log("웹소켓 연결 해제");
    }
  };

  //   // STOMP 메시지 수신 이벤트 핸들링 -> 웹소켓
  useEffect(() => {
    subscribe();
  }, [chatList]);

  /* STOMP 메시지 수신 이벤트 핸들링
  sub 채팅방 입장 */
  const subscribe = () => {
    if (!stompClient) return;
    if (data.chatRoomId) {
      // 초기
      stompClient.subscribe(`/sub/chat/room/${data.chatRoomId}`, (message) => {
        const chatMessage = JSON.parse(message.body);
        setChatList((prevChatList) => [...prevChatList, chatMessage]);
      });
    } else {
      // 존재하는경우
      stompClient.subscribe("/sub/chat/room", (message) => {
        const chatMessage = JSON.parse(message.body);
        // data.chatRoomId = message.body;
        setChatList((prevChatList) => [...prevChatList, chatMessage]);
        // const chatRoomId = message.body;
        // setChatData((prevData) => ({
        //   ...prevData,
        //   chatRoomId: chatRoomId,
        // }));
      });
    }
  };

  const { isError, isLoading, data } = useQuery(["Chatting", receiverId], () =>
    Chatting(receiverId)
  );
  console.log("채팅할사람", data);

  if (isLoading) {
    return <h1>로딩 중입니다(oﾟvﾟ)ノ</h1>;
  }

  if (isError) {
    console.log("오류", isError);
    return <h1>오류(⊙ˍ⊙)</h1>;
  }

  /*  STOMP 메시지 송신
    puc 메세지 보내기 */
  const sendMessage = () => {
    if (stompClient && message) {
      const chatMessage = {
        message: message,
        senderId: userId,
        receiverId: data.receiverId,
        chatRoomId: data.chatRoomId,
      };
      stompClient.send("/pub/chat/send", {}, JSON.stringify(chatMessage));

      setChatList((prevChatList) => [...prevChatList, chatMessage]);

      setMessage("");
    }
  };
  console.log("채팅리스트", setChatList);

  if (!data.chatRoomId) {
    /* 채팅방이 없는 경우 */
    return (
      <ChatContainer>
        <ReceiverProfile src={data.receiverProfileImg} alt="Receiver Profile" />
        <Nickname>{data.receiverNickName}</Nickname>
        {data.chatList.map((chat) => (
          <p key={chat.id}>{chat.message}</p>
        ))}
        <p>No chat room available</p>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={sendMessage}>Send</button>
      </ChatContainer>
    );
  }
  return (
    /* 채팅방이 존재 */
    // <div>
    //   <p>Chat Room ID: {data.chatRoomId}</p>
    //   <ReceiverProfile src={data.receiverProfileImg} alt="Receiver Profile" />
    //   <p>{data.receiverNickName}</p>
    //   {data.chatList.map((chat) => (
    //     <p key={chat.id}>{chat.message}</p>
    //   ))}
    //   <input
    //     type="text"
    //     value={message}
    //     onChange={(e) => setMessage(e.target.value)}
    //   />
    //   <button onClick={sendMessage}>Send</button>
    // </div>
    <ChatContainer>
      <ReceiverProfile src={data.receiverProfileImg} alt="Receiver Profile" />
      <Nickname>{data.receiverNickName}</Nickname>
      {data.chatList.map((chat) => (
        <ChatBubble
          key={chat.id}
          isSender={chat.senderId === userId}
          isReceiver={chat.receiverId === userId}
        >
          {chat.message}
        </ChatBubble>
      ))}
      <ChatInputContainer>
        <ChatInput
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <SendButton onClick={sendMessage}>Send</SendButton>
      </ChatInputContainer>
    </ChatContainer>
  );
}

export default ChatTest;

const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  /* align-items: center; */
`;

const ReceiverProfile = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 50%;
`;

const Nickname = styled.div`
  margin-left: 8px;
  font-size: 20px;
`;

const ChatBubble = styled.div`
  background-color: ${(props) =>
    props.isSender ? "#DCF8C6" : props.isReceiver ? "#F3F3F3" : "transparent"};
  padding: 8px;
  margin-top: 8px;
  border-radius: 8px;
`;

const ChatInputContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 16px;
`;

const ChatInput = styled.input`
  flex: 1;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const SendButton = styled.button`
  margin-left: 8px;
  padding: 8px 16px;
  background-color: #4caf50;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;
