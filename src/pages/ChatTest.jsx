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

  const [chatMessages, setChatMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [overLimit, setOverLimit] = useState(false); // 메세지 길이 제한

  const client = useRef({});
  const scrollRef = useRef();

  const { isError, isLoading, data } = useQuery(["Chatting", receiverId], () =>
    Chatting(receiverId)
  );
  // console.log("채팅할사람", data);

  useEffect(() => {
    if (data?.chatList) {
      setChatMessages(data?.chatList);
    }
  }, [data]);

  /* 메세지 입력시, 채팅방 들어왔을 때 스크롤 이동 */
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages]);

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
    return <h1>오류(⊙ˍ⊙)</h1>;
  }

  const publish = (message) => {
    if (!client.current.connected || !message.trim()) {
      // message.trim()으로 메시지 앞뒤의 공백 제거 후 내용이 있는지 확인
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
    setOverLimit(false);
  };
  /* Enter key 메시지 전송 */
  const enterHandler = (e, message) => {
    // 메시지가 비어있고 enter키 눌렀을 때 동작 방지
    if (message.trim() === "" && e.which === 13) {
      e.preventDefault();
    }
    // 줄 바꿈
    else if (e.shiftKey && e.which === 13 && message.trim() !== "") {
      setMessage(message + "\n");
      e.preventDefault();
    }
    // enter 키를 누르면 메시지 전송
    else if (!e.shiftKey && e.which === 13 && message.trim() !== "") {
      publish(message);
      e.preventDefault();
    }
  };

  return (
    <EntireContainer>
      {chatMessages && chatMessages.length > 0 && (
        <ChatContainer>
          {chatMessages.map((_chatMessage, index) => (
            <React.Fragment key={_chatMessage.uuid}>
              {_chatMessage.senderId !== userId && (
                <MessageContainer>
                  {/* <ReceiverProfile
                  isSender={_chatMessage.senderId === userId}
                  src={
                    _chatMessage.senderId === userId
                      ? profileImg
                      : data.receiverProfileImg
                  }
                  alt="Profile"
                /> */}
                  <ReceiverProfile
                    src={data.receiverProfileImg}
                    alt="Profile"
                  />
                  {/* <Nickname isSender={_chatMessage.senderId === userId}>
                  {_chatMessage.senderId === userId
                    ? nickName
                    : data.receiverNickName}
                </Nickname> */}
                  <Nickname>{data.receiverNickName}</Nickname>
                </MessageContainer>
              )}
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
      <div ref={scrollRef}></div>
      <SendContainer>
        {overLimit && <span>1000자를 초과하였습니다!</span>}
        <ChatInputContainer>
          <ChatInput
            rows={1}
            type={"text"}
            value={message}
            onChange={(e) => {
              if (e.target.value.length <= 1000) {
                setMessage(e.target.value);
                setOverLimit(false); // 길이 제한이 초과되지 않았으므로 경고를 숨김
              } else {
                setOverLimit(true); // 길이 제한이 초과되었으므로 경고를 표시
              }
            }}
            // 만약 눌린 키가 Enter 키이면 publish(message) 함수를 실행
            onKeyDown={(e) => enterHandler(e, message)}
          />
          <SendButton onClick={() => publish(message)}>전송</SendButton>
        </ChatInputContainer>
      </SendContainer>
    </EntireContainer>
  );
};

export default ChatTest;

const EntireContainer = styled.div``;

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
  overflow: auto;
`;

const SendContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 800px;
  margin: 10px auto;

  span {
    color: red;
  }
`;

const MessageContainer = styled.div`
  display: flex;
  align-items: center;
  align-self: ${(props) => (props.isSender ? "flex-end" : "flex-start")};
  margin: 10px 0;
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
  white-space: pre-wrap; // 줄바꿈과 공백 유지
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

const ChatInput = styled.textarea`
  flex: 1;
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  resize: none; // 사용자가 크기를 조절하지 못하게 함
`;

const SendButton = styled.button`
  margin-left: 8px;
  padding: 8px 30px;
  background-color: #483767;
  color: #fff;
  border: none;
  border-radius: 4px;
`;
