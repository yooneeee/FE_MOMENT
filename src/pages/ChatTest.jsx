import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import * as StompJs from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useQuery } from "react-query";
import { Chatting } from "../apis/mypage/chatting";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import LoadingSpinner from "../components/LoadingSpinner";
import ChatList from "./ChatList";
import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  #root {
    overflow: hidden;
    height: 100vh;
  }
`;

const ChatTest = () => {
  const { receiverId } = useParams();
  const { userId, nickName, profileImg } = useSelector((state) => state.user);

  const [chatMessages, setChatMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [overLimit, setOverLimit] = useState(false); // 메세지 길이 제한
  const [chatDates, setChatDates] = useState([]); // 날짜

  const client = useRef({});
  const scrollRef = useRef();

  /* 시간을 변환하는 함수->오전, 오후 */
  const formatAMPM = (date) => {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const ampm = hours >= 12 ? "오후" : "오전";
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    const strTime = ampm + " " + hours + ":" + minutes + " ";
    return strTime;
  };

  const { isError, isLoading, data } = useQuery(["Chatting", receiverId], () =>
    Chatting(receiverId)
  );
  // console.log("채팅할사람", data);

  // useEffect(() => {
  //   if (data?.chatList) {
  //     setChatMessages(data?.chatList);
  //   }
  // }, [data]);
  useEffect(() => {
    if (data?.chatList) {
      setChatMessages(data?.chatList);

      const dates = new Set(
        data?.chatList.map((msg) => new Date(msg.createdAt).toDateString())
      );
      setChatDates([...dates]);
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
    <>
      <GlobalStyle />
      <EntireContainer>
        <ChatList />
        <ChatRoomContainer>
          <SenderUserContainer>
            <UserProfileImage
              src={data.receiverProfileImg}
              alt="profile image"
            />
            <SenderName>
              {data.receiverRole} | {data.receiverNickName}
            </SenderName>
          </SenderUserContainer>
          <Line />
          <ScrollableDiv>
            {chatMessages && chatMessages.length > 0 && (
              <ChatContainer>
                <GuideText>
                  <span>{data.receiverNickName}님과 대화를 시작합니다</span>
                </GuideText>
                {chatMessages.map((_chatMessage, index) => (
                  <React.Fragment key={_chatMessage.uuid}>
                    <GuideText>
                      {(index === 0 ||
                        new Date(
                          _chatMessage.createdAt
                        ).toLocaleDateString() !==
                          new Date(
                            chatMessages[index - 1].createdAt
                          ).toLocaleDateString()) && (
                        <div>
                          {new Date(_chatMessage.createdAt)
                            .toLocaleDateString()
                            .replace(
                              /(\d{4})\. (\d{1,2})\. (\d{1,2})\./,
                              "$1년 $2월 $3일"
                            )}
                        </div>
                      )}
                    </GuideText>
                    <MessageWrapper isSender={_chatMessage.senderId === userId}>
                      <ProfileContainer>
                        <ReceiverProfile
                          isSender={_chatMessage.senderId === userId}
                          src={
                            _chatMessage.senderId === userId
                              ? profileImg
                              : data.receiverProfileImg
                          }
                          alt="Profile"
                        />
                      </ProfileContainer>
                      <MessageContainer>
                        <ChatBubble
                          key={index}
                          isSender={_chatMessage.senderId === userId}
                          isReceiver={_chatMessage.receiverId === userId}
                        >
                          {_chatMessage.message}
                        </ChatBubble>
                        {/* <Time>{todayTime()}</Time> */}
                      </MessageContainer>
                      <Time>
                        {formatAMPM(new Date(_chatMessage.createdAt))}
                      </Time>
                    </MessageWrapper>
                  </React.Fragment>
                ))}
              </ChatContainer>
            )}
            <div ref={scrollRef}></div>
            <SendContainer>
              {overLimit && <span>999자를 초과하였습니다!</span>}
              <ChatInputContainer>
                <ChatInput
                  placeholder="메세지를 입력해주세요."
                  maxLength={1000}
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
          </ScrollableDiv>
        </ChatRoomContainer>
      </EntireContainer>
    </>
  );
};

export default ChatTest;

const GuideText = styled.div`
  text-align: center;
  margin: 10px 0;
  font-size: 15px;
`;

const UserProfileImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
`;

// const Nick = styled.div`
//   margin-left: 300px;
//   display: flex;
// `;
const SenderUserContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  top: 6%;
  margin-left: 20px;
`;
const SenderName = styled.span`
  font-weight: bold;
  color: #000;
  font-size: 15px;
  margin-left: 15px;
`;

const MessageWrapper = styled.div`
  display: flex;
  flex-direction: ${(props) => (props.isSender ? "row-reverse" : "row")};
  /* align-items: colum; */
  align-items: center;
  /* justify-content: space-between; */
  align-self: ${(props) => (props.isSender ? "flex-end" : "flex-start")};
  /* margin: 10px 0; */
`;

const ScrollableDiv = styled.div`
  overflow-y: auto;
  height: calc(100% - 80px);

  /* // For Webkit-based Browsers
  ::-webkit-scrollbar {
    display: none;
  }

  // For Firefox
  scrollbar-width: none; */
`;

const EntireContainer = styled.div`
  display: flex;
  width: 100%;
  /* height: 100vh; */
  height: calc(100vh - 190px);
  max-width: 80%;
  /* max-height: 60%; */
  margin: auto;
  overflow: hidden;
`;
const ChatRoomContainer = styled.div`
  flex: 2; // 차지하는 공간의 비율을 2로 설정
  border-left: 1px solid #ccc;
  /* padding: 20px; */
  /* overflow: auto; */
  max-height: 900px;
  padding: 0px 90px 0px 0px;

  /* display: flex; */
`;
const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  /* align-items: flex-start; */
  width: 100%;
  /* max-width: 800px; */
  padding: 0px 20px;
  /* align-items: center; */
  margin: 20px 0;

  position: relative;
  min-height: 61vh;
`;

const SendContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 800px;
  margin: 10px auto;
`;

const MessageContainer = styled.div`
  display: flex;
  align-items: center;
  /* align-self: ${(props) => (props.isSender ? "flex-end" : "flex-start")}; */
  margin: 10px 15px;
  flex-direction: ${(props) => (props.isSender ? "row-reverse" : "row")};
`;
const ProfileContainer = styled.div`
  display: flex;
  align-items: center;
  align-self: ${(props) => (props.isSender ? "flex-end" : "flex-start")};
  margin: 10px 0;
`;

const ReceiverProfile = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  align-self: ${(props) => (props.isSender ? "flex-end" : "flex-start")};
`;

const ChatBubble = styled.div`
  background-color: ${(props) =>
    props.isSender ? "#483767" : props.isReceiver ? "#ebe8f0" : "transparent"};
  color: ${(props) =>
    props.isSender ? "#ffffff" : props.isReceiver ? "#000000" : "transparent"};
  padding: 8px 13px;
  border-radius: 13px;
  white-space: pre-wrap; // 줄바꿈과 공백 유지
  position: relative;

  &:after {
    content: "";
    position: absolute;

    width: 0;
    height: 0;
    border: 9px solid transparent;
    ${(props) =>
      props.isSender
        ? `right: -8px; border-left-color: #483767; border-right: none; top: 9px;`
        : `left: -8px; border-right-color: #ebe8f0; border-left: none; top: 9px;`}
  }
`;
const Time = styled.div`
  font-size: 13px;
  color: #a0a0a0;
  margin-top: 20px;
`;
const ChatInputContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 16px;
  border: 1px solid #a0a0a0;
  border-radius: 4px;

  /* position: absolute; */
  /* bottom: 20px; */
  /* left: 50%; */
  /* transform: translateX(-50%); */
`;

const ChatInput = styled.textarea`
  flex: 1;
  width: 100%;
  height: 70px;
  padding: 8px;
  border: none;
  outline: none;
  border-radius: 4px;
  resize: none; // 사용자가 크기를 조절하지 못하게 함
`;

const SendButton = styled.button`
  margin-left: 8px;
  margin-right: 4px;
  margin-top: 30px;
  padding: 8px 20px;
  background-color: #483767;
  color: #fff;
  border: none;
  border-radius: 8px;
`;
const Line = styled.div`
  border-top: 1px solid #d6d6d6;
  width: 100%;
  margin-top: 70px;
`;
