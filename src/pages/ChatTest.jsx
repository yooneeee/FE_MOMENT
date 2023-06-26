import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import * as StompJs from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useQuery, useQueryClient } from "react-query";
import { Chatting, ChattingRoomDelete } from "../apis/mypage/chatting";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import LoadingSpinner from "../components/LoadingSpinner";
import ChatList from "./ChatList";
import { createGlobalStyle } from "styled-components";
import { useMutation } from "react-query";
import Swal from "sweetalert2";

const GlobalStyle = createGlobalStyle`
  #root {
    overflow: hidden;
    height: 100vh;
  }
`;

const ChatTest = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { receiverId } = useParams();
  const { userId, profileImg } = useSelector((state) => state.user);

  const [chatMessages, setChatMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [overLimit, setOverLimit] = useState(false); // 메세지 길이 제한
  const [chatDates, setChatDates] = useState([]); // 날짜
  const [isVisible, setIsVisible] = useState(true); // 삭제후 채팅방 상태관리

  const [messageCharacters, setMessageCharacters] = useState(0);
  const messageMaxLength = 500;

  const client = useRef({});
  const scrollRef = useRef();

  /* 시간을 변환하는 함수->오전, 오후 */
  // const formatAMPM = (date) => {
  //   let hours = date.getHours();
  //   let minutes = date.getMinutes();
  //   const ampm = hours >= 12 ? "오후" : "오전";
  //   hours = hours % 12;
  //   hours = hours ? hours : 12;
  //   minutes = minutes < 10 ? "0" + minutes : minutes;
  //   const strTime = ampm + " " + hours + ":" + minutes + " ";
  //   return strTime;
  // };
  const getHours = (date) => {
    let hours = date.getHours();
    return hours > 12 ? hours - 12 : hours;
  };

  const getMinutes = (date) => {
    let minutes = date.getMinutes();
    return minutes < 10 ? "0" + minutes : minutes;
  };

  const getAMPM = (date) => {
    return date.getHours() >= 12 ? "오후" : "오전";
  };

  const { isError, isLoading, data, error } = useQuery(
    ["Chatting", receiverId],
    () => Chatting(receiverId)
  );
  // console.log("채팅할사람", data);
  const chatRoomIds = data?.chatList?.map((item) => item.chatRoomId);
  // console.log("챗룸", chatRoomIds);

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

  /* 채팅방 삭제 서버 */
  const deleteMutation = useMutation(ChattingRoomDelete, {
    onSuccess: () => {
      queryClient.invalidateQueries("ChattingList");
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const chatRoomDelete = (chatRoomId) => {
    try {
      Swal.fire({
        title: "채팅방 나가시겠습니까?",
        text: "나가기를 하면 대화내용이 모두 삭제되고 채팅목록에서도 삭제됩니다.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#483767",
        cancelButtonColor: "#c4c4c4",
        confirmButtonText: "삭제",
        cancelButtonText: "취소",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            await deleteMutation.mutateAsync(chatRoomId);
            // setIsVisible(false);
            navigate("/chatroomlist/${hostId}");

            Swal.fire({
              title: "채팅방 삭제 되었습니다✨",
              icon: "success",
              confirmButtonColor: "#483767",
              confirmButtonText: "완료",
            });
          } catch (error) {
            Swal.fire({
              title: "삭제 실패!",
              text: "포트폴리오 삭제 중 오류가 발생했습니다.",
              icon: "error",
              confirmButtonColor: "#483767",
              confirmButtonText: "확인",
            });
          }
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

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

  const sendMessage = useMutation(
    async (message) => {
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
      setMessageCharacters(0);
    },
    {
      onSuccess: () => {
        // 새 메시지를 성공적 -> 채팅 목록 query를 무효화하여 다시 fetch
        queryClient.invalidateQueries("ChattingList");
      },
      onError: (error) => {
        console.error(error);
      },
    }
  );

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
      // client.current?.subscribe(`/pub/chat/read`, ({ body }) => {
      //   const readStatusUpdate = JSON.parse(body);
      //   console.log("확인:::", readStatusUpdate);

      //   setChatMessages((prevChatMessages) =>
      //     prevChatMessages.map((message) =>
      //       data.chatRoomId === chatRoomIds
      //         ? { ...message, readStatus: readStatusUpdate.readStatus }
      //         : message
      //     )
      //   );
      //   console.log("확인:::", readStatusUpdate);
      //   // readStatusUpdate에 따라 필요한 동작을 수행합니다.
      //   // 예를 들어, 메시지를 읽은 상태로 표시하거나, 읽지 않은 메시지 개수를 업데이트하는 등의 동작을 수행할 수 있습니다.
      // });
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
  if (isError) {
    if (error.response.request.status === 401) {
      Swal.fire({
        icon: "error",
        title: "로그인이후 이용가능한 페이지입니다!",
        confirmButtonText: "확인",
      }).then(() => {
        navigate("/");
      });
    }
    return null;
  }

  if (isError || !data) {
    return <h1>오류(⊙ˍ⊙)</h1>;
  }

  /*   const publish = (message) => {
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
    setMessageCharacters(0);
  }; */
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
      // publish(message);
      sendMessage.mutate(message);
      e.preventDefault();
    }
  };

  /*   const handleMessageInput = (e) => {
    publish(message);
    // setMessage(e.target.value);
    // setMessageCharacters(0);
  }; */

  return (
    <>
      <GlobalStyle />
      <EntireContainer>
        <ChatList />
        {isVisible && (
          <ChatRoomContainer>
            <SenderUserContainer>
              <UserProfileImage
                src={data.receiverProfileImg}
                alt="profile image"
              />
              <div style={{ flexGrow: 1 }}>
                <SenderName>
                  {data.receiverRole} | {data.receiverNickName}
                </SenderName>
              </div>
              <ExitButton
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  chatRoomDelete(data.chatRoomId);
                }}
              >
                나가기
              </ExitButton>
            </SenderUserContainer>
            <Line />
            <ScrollableDiv>
              {chatMessages && chatMessages.length > 0 && (
                <ChatContainer>
                  <GuideText>
                    <span>{data.receiverNickName}님과 대화를 시작합니다</span>
                  </GuideText>
                  {chatMessages.map((_chatMessage, index, arr) => (
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
                      <MessageWrapper
                        isSender={_chatMessage.senderId === userId}
                      >
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
                        <ParentContainer
                          isSender={_chatMessage.senderId === userId}
                        >
                          <MessageContainer>
                            <ChatBubble
                              key={index}
                              isSender={_chatMessage.senderId === userId}
                              isReceiver={_chatMessage.receiverId === userId}
                            >
                              {_chatMessage.message}
                            </ChatBubble>
                          </MessageContainer>
                          {index === arr.length - 1 ||
                          new Date(_chatMessage.createdAt).getMinutes() !==
                            new Date(arr[index + 1].createdAt).getMinutes() ? (
                            <Time isSender={_chatMessage.senderId === userId}>
                              {getAMPM(new Date(_chatMessage.createdAt)) +
                                " " +
                                getHours(new Date(_chatMessage.createdAt)) +
                                ":" +
                                getMinutes(new Date(_chatMessage.createdAt))}
                            </Time>
                          ) : null}
                        </ParentContainer>
                      </MessageWrapper>
                    </React.Fragment>
                  ))}
                </ChatContainer>
              )}
              <div ref={scrollRef}></div>
              <SendContainer>
                {overLimit && <span>500자 초과하였습니다!</span>}
                <ChatInputContainer>
                  <ChatInput
                    placeholder="메세지를 입력해주세요."
                    maxLength={500}
                    rows={1}
                    type={"text"}
                    value={message}
                    onChange={(e) => {
                      const newValue = e.target.value;
                      if (newValue.length <= messageMaxLength) {
                        setMessage(newValue);
                        setMessageCharacters(newValue.length);
                        setOverLimit(false); // 길이 제한이 초과되지 않았으므로 경고를 숨김
                      } else {
                        setOverLimit(true); // 길이 제한이 초과되었으므로 경고를 표시
                      }
                    }}
                    // 만약 눌린 키가 Enter 키이면 publish(message) 함수를 실행
                    onKeyDown={(e) => enterHandler(e, message)}
                  />
                  <Bundle>
                    <span>
                      {messageCharacters}/{messageMaxLength}
                    </span>
                    {/* <SendButton onClick={handleMessageInput}>전송</SendButton> */}
                    <SendButton onClick={() => sendMessage.mutate(message)}>
                      전송
                    </SendButton>
                  </Bundle>
                </ChatInputContainer>
              </SendContainer>
            </ScrollableDiv>
          </ChatRoomContainer>
        )}
      </EntireContainer>
    </>
  );
};

export default ChatTest;

const ExitButton = styled.button`
  border: none;
  background-color: #ebe8f0;
  border-radius: 4px;
  padding: 8px;
  margin-right: 10px;
  font-size: 15px;

  &:hover {
    background-color: #483767;
    color: #ffffff;
  }
`;

const GuideText = styled.div`
  text-align: center;
  margin: 10px 0;
  font-size: 15px;
`;

const UserProfileImage = styled.img`
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 50%;
`;

const SenderUserContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  top: 6%;
  margin-left: 20px;

  justify-content: space-between;
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
  align-items: center;
  align-self: ${(props) => (props.isSender ? "flex-end" : "flex-start")};
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
  height: calc(100vh - 190px);
  max-width: 75%;
  margin: auto;
  overflow: hidden;
`;
const ChatRoomContainer = styled.div`
  flex: 2; // 차지하는 공간의 비율을 2로 설정
  border-left: 1px solid #ccc;
  max-height: 900px;
`;
const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 0px 20px;
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
  margin: 0 auto;
`;
const ParentContainer = styled.div`
  display: flex;
  align-items: flex-end;
  flex-direction: ${(props) => (props.isSender ? "row-reverse" : "row")};
`;

const MessageContainer = styled.div`
  display: flex;
  align-items: center;
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
  object-fit: cover;
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

  white-space: pre-wrap;
  word-wrap: break-word;
  max-width: 550px; /* 한 줄에 표시되는 최대 너비 */
  overflow-wrap: break-word;

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
  margin-bottom: 10px;
`;
const ChatInputContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 16px;
  border: 1px solid #a0a0a0;
  border-radius: 4px;
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
const Bundle = styled.div`
  display: flex;
  flex-direction: column;
  margin: 5px;
  & span {
    margin-left: 8px;
  }
`;

const SendButton = styled.button`
  margin-left: 8px;
  margin-top: 10px;
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
