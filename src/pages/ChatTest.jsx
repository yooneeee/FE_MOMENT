import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import * as StompJs from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useQuery } from "react-query";
import { Chatting } from "../apis/mypage/chatting";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import LoadingSpinner from "../components/LoadingSpinner";

const ChatTest = () => {
  const { receiverId } = useParams();
  const { userId, nickName, profileImg } = useSelector((state) => state.user);

  const client = useRef({});
  const [chatMessages, setChatMessages] = useState([]);
  const [message, setMessage] = useState("");

  const { isError, isLoading, data } = useQuery(["Chatting", receiverId], () =>
    Chatting(receiverId)
  );
  // console.log("채팅할사람", data);

  const chatRoomId = data?.chatRoomId;
  // console.log("모먼트", data?.chatRoomId);

  useEffect(() => {
    if (data?.chatList) {
      setChatMessages(data?.chatList);
    }
  }, [data]);

  const connect = () => {
    client.current = new StompJs.Client({
      webSocketFactory: () =>
        new SockJS(`${process.env.REACT_APP_SERVER_URL}/ws-edit`), // proxy를 통한 접속

      debug: function (str) {
        // console.log(str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        subscribe();
      },
      onStompError: (frame) => {
        // console.error(frame);
      },
    });

    client.current.activate();
  };

  const disconnect = () => {
    client.current.deactivate();
  };

  const subscribe = () => {
    if (data?.chatRoomId) {
      client.current?.subscribe(
        `/sub/chat/room/${data.chatRoomId}`,
        ({ body }) => {
          setChatMessages((_chatMessages) => [
            ..._chatMessages,
            JSON.parse(body),
          ]);
        }
      );
    }
  };

  // useEffect(() => {
  //   connect();

  //   return () => disconnect();
  // }, []);
  // useEffect(() => {
  //   if (data) {
  //     // Check if data has been loaded
  //     connect();
  //   }
  //   return () => disconnect();
  // }, [data]);
  useEffect(() => {
    if (data?.chatRoomId) {
      // chatRoomId가 존재할 때만 connect 함수 실행
      connect();
      return () => disconnect(); // 컴포넌트 unmount 시점에 disconnect
    }
  }, [data?.chatRoomId]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError || !data) {
    // console.log("오류", isError);
    return <h1>오류(⊙ˍ⊙)</h1>;
  }

  const publish = (message) => {
    if (!client.current.connected) {
      return;
    }

    client.current.publish({
      destination: "/pub/chat/send",
      body: JSON.stringify({
        message: message,
        senderId: userId,
        receiverId: data.receiverId,
        chatRoomId: data.chatRoomId,
      }),
    });

    setMessage("");
  };

  return (
    <>
      {chatMessages && chatMessages.length > 0 && (
        <ChatContainer>
          {/* {chatMessages.map((_chatMessage, index) => (
            <li key={index}>{_chatMessage.message}</li>
          ))} */}
          {chatMessages.map((_chatMessage, index) => (
            <React.Fragment key={_chatMessage.uuid}>
              <ReceiverProfile
                isSender={_chatMessage.senderId === userId}
                src={
                  _chatMessage.senderId === userId
                    ? profileImg
                    : data.receiverProfileImg
                }
                alt="Profile"
              />
              <Nickname isSender={_chatMessage.senderId === userId}>
                {_chatMessage.senderId === userId
                  ? nickName
                  : data.receiverNickName}
              </Nickname>
              <ChatBubble
                key={index}
                isSender={_chatMessage.senderId === userId}
                isReceiver={_chatMessage.receiverId === userId}
              >
                {_chatMessage.message}
              </ChatBubble>
            </React.Fragment>
          ))}
        </ChatContainer>
      )}
      <SendContainer>
        <ChatInputContainer>
          <ChatInput
            type={"text"}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            // onKeyPress={(e) => enterHandler(e)}
            onKeyPress={(e) => e.which === 13 && publish(message)}
          />
          <SendButton onClick={() => publish(message)}>전송</SendButton>
        </ChatInputContainer>
      </SendContainer>
    </>
  );
};

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
  margin: 10px auto;

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
