import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { ChattingList } from "../apis/mypage/chatting";
import { useQuery } from "react-query";
import { Link, useNavigate } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import { FiSearch } from "react-icons/fi";
import * as StompJs from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";

function ChatList() {
  const {
    isError,
    isLoading,
    data: initialData,
    error,
  } = useQuery("ChattingList", ChattingList);
  // console.log("데이터", data);
  const [isClicked, setIsClicked] = useState(null);
  const [search, setSearch] = useState("");
  const client = useRef({});
  const [data, setData] = useState(initialData);
  const { userId } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const handleClick = (id) => {
    setIsClicked(id);
  };

  const updateSearch = (e) => {
    setSearch(e.target.value);
  };

  const connect = () => {
    client.current = new StompJs.Client({
      webSocketFactory: () =>
        new SockJS(`${process.env.REACT_APP_SERVER_URL}/ws-edit`), // proxy를 통한 접속

      debug: function (str) {
        console.log(str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        subscribe();
      },
      onStompError: (frame) => {
        console.error(frame);
      },
    });

    client.current.activate();
  };

  const disconnect = () => {
    client.current.deactivate();
  };

  const subscribe = () => {
    client.current?.subscribe(`/sub/chat/list/${userId}`, ({ body }) => {
      const updatedChat = JSON.parse(body);

      // Find the index of the chat room to be updated.
      const index = data.findIndex(
        (chat) => chat.chatRoomId === updatedChat.chatRoomId
      );

      // If found, replace the chat room with the updated one.
      if (index !== -1) {
        setData([
          ...data.slice(0, index),
          updatedChat,
          ...data.slice(index + 1),
        ]);
      }
    });
  };

  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  useEffect(() => {
    connect();
    return () => disconnect();
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
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
  }

  return (
    <>
      <ChatListContainer>
        <ChatSearchContainer>
          {/* <StyledIcon /> */}

          <ChatSearch
            placeholder="Role, NickName 검색"
            value={search}
            onChange={updateSearch}
          />
        </ChatSearchContainer>
        <Line />
        {(!data || data.length === 0) && (
          <EmptyChatList>
            <p>채팅목록이 없습니다. 채팅을 시작해보세요!</p>
          </EmptyChatList>
        )}
        <ScrollableDiv>
          {data &&
            data
              .filter(
                (item) =>
                  item.receiverNickName.includes(search) ||
                  item.receiverRole.includes(search)
              )
              .map((item) => (
                <Link to={`/chattest/${item.receiverId}`} key={item.chatRoomId}>
                  <List
                    isClicked={isClicked === item.chatRoomId}
                    onClick={() => handleClick(item.chatRoomId)}
                  >
                    <ChatItem>
                      <ProfileImage
                        src={item.receiverProfileImg}
                        alt="profile image"
                      />
                      <Content>
                        <SenderNameContainer>
                          <SenderName>
                            {item.receiverRole} | {item.receiverNickName}
                          </SenderName>
                        </SenderNameContainer>
                        <MessageContainer>
                          {item.lastChat && (
                            <Message>
                              {item.lastChat.message.length > 15
                                ? item.lastChat.message.slice(0, 15) + "..."
                                : item.lastChat.message}
                            </Message>
                          )}
                          <HaveToRead>
                            {item.haveToRead && (
                              <UnreadBadge>읽지 않음</UnreadBadge>
                            )}
                          </HaveToRead>
                        </MessageContainer>
                      </Content>
                    </ChatItem>
                  </List>
                </Link>
              ))}
        </ScrollableDiv>
      </ChatListContainer>
    </>
  );
}

export default ChatList;

const EmptyChatList = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 30px;

  p {
    font-size: 18px;
    font-weight: bold;
    color: #333333;
  }
`;

const UnreadBadge = styled.span`
  background-color: #483767;
  color: white;
  font-size: 12px;
  padding: 6px 12px;
  border-radius: 50px;
`;

const ScrollableDiv = styled.div`
  overflow-y: auto;
  height: calc(100% - 70px);

  ::-webkit-scrollbar {
    display: none;
  }

  scrollbar-width: none;
`;

const ChatSearchContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;

  position: relative;
  width: 100%;
  height: 72px;
  top: 1%;
`;
const ChatSearch = styled.input`
  border-radius: 50px;
  /* padding: 10px;
  width: 70%; */
  padding-left: 45px;
  width: 60%;
  height: 80%;
  background-color: #e4e4e4;
  border: none;
  outline: none;
`;
const StyledIcon = styled(FiSearch)`
  position: absolute;
  left: 110px; // 아이콘의 위치를 필요에 따라 조정하세요.
  top: 50%;
  transform: translateY(-50%);
`;

const ChatListContainer = styled.div`
  /* width: 100%; */
  /* max-width: 50%; */
  height: 100vh;
  max-height: 100%;
  display: flex;
  /* padding: 0px 0px 0px 90px; */
  margin-top: 20px;
  flex-direction: column;
  flex: 1;
`;

const List = styled.button`
  background-color: #fff;
  border-radius: 50px 0 0 50px;
  /* box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); */
  padding: 10px;
  width: 100%;
  border: none;

  background-color: ${(props) => (props.isClicked ? "#ebe8f0" : "initial")};
  &:hover {
    background-color: #ebe8f0;
  }
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
  width: 60px;
  height: 60px;
  border-radius: 50%;
`;

const Content = styled.div`
  display: flex;
  width: 80%;
  flex-direction: column;
  justify-content: space-between;
  align-items: space-between;
  margin-left: 12px;
  row-gap: 5px;
`;

const SenderNameContainer = styled.div`
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;
const SenderName = styled.span`
  font-weight: bold;
  color: #000;
  font-size: 15px;
`;

const MessageContainer = styled.div`
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const HaveToRead = styled.div`
  height: 20px;
  width: 80px;
  display: flex;
  align-items: center;
  /* justify-content: flex-end; */
`;
const Message = styled.span`
  color: #929292;
`;
const Line = styled.div`
  border-top: 1px solid none;
  width: 100%;
`;
