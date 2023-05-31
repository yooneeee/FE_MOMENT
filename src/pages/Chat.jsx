import React, { useRef, useState, useEffect } from "react";
import { useParams } from "react-router";
import * as StompJs from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { Chatting } from "../apis/mypage/chatting";
import { useQuery } from "react-query";
import { instance } from "../apis/axios";

function Chat() {
  // const { isLoading, isError, data } = useQuery("Chatting", Chatting);
  // console.log(data);

  // if (isLoading) {
  //   return <h1>로딩 중입니다..!</h1>;
  // }

  // if (isError) {
  //   return <h1>{isError}</h1>;
  // }
  const [chatList, setChatList] = useState([]);
  const [chat, setChat] = useState("");

  const { apply_id } = useParams();
  const client = useRef({});

  // const connect = () => {
  //   client.current = new StompJs.Client({
  //     brokerURL: "ws://15.165.14.7/ws-edit",
  //     onConnect: () => {
  //       console.log("success");
  //       subscribe();
  //     },
  //   });

  //   client.current.activate(); // 소켓 연결을 해주는 method
  // };

  const connect = () => {
    const socket = new SockJS("http://15.165.14.7/ws-edit");
    const stompClient = StompJs.Stomp.over(socket);
    stompClient.connect({}, () => {
      console.log("Connected to WebSocket");
      subscribe();
    });
    client.current = stompClient;
  };
  // console.log(client.current);

  const publish = (chat) => {
    if (!client.current.connected) return;

    client.current.publish({
      destination: "/pub/chat",
      body: JSON.stringify({
        applyId: apply_id,
        chat: chat,
      }),
    });

    setChat("");
  };

  const subscribe = () => {
    client.current.subscribe("/sub/chat/room" + apply_id, (body) => {
      const json_body = JSON.parse(body.body);
      setChatList((_chat_list) => [..._chat_list, json_body]);
    });
  };

  const disconnect = () => {
    client.current.deactivate();
  };

  const handleChange = (event) => {
    // 채팅 입력 시 state에 값 설정
    setChat(event.target.value);
  };
  const handleSubmit = (event) => {
    // 보내기 버튼 눌렀을 때 publish
    event.preventDefault();

    publish(chat);
  };

  // 프로필 이미지 가져오기
  const getProfileImage = async (userId) => {
    try {
      const response = await instance.get(`/chatRoom/enter/${userId}`);
      return response.data.profileImageUrl;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  // 사용자 닉네임 가져오기
  const getNickname = async (userId) => {
    try {
      const response = await instance.get(`/chatRoom/enter/${userId}`);
      return response.data.nickname;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  useEffect(() => {
    connect();

    return () => disconnect();
  }, []);

  useEffect(() => {
    // chatList에 있는 모든 채팅의 프로필 이미지와 닉네임 가져오기
    const fetchProfileAndNickname = async () => {
      const updatedChatList = await Promise.all(
        chatList.map(async (chat) => {
          const profileImg = await getProfileImage(chat.userId);
          const nickname = await getNickname(chat.userId);
          return {
            ...chat,
            receiverProfileImg: profileImg,
            receiverNickname: nickname,
          };
        })
      );
      setChatList(updatedChatList);
    };

    fetchProfileAndNickname();
  }, [chatList]);

  return (
    <div>
      <div className={"chat-list"}>
        {chatList.map((chat, index) => (
          <div key={index}>
            {chat.receiverProfileImg && (
              <img src={chat.receiverProfileImg} alt="Profile" />
            )}
            {chat.receiverNickname && <span>{chat.receiverNickname}: </span>}
            {chat.chat}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type={"text"}
            name={"chatInput"}
            onChange={handleChange}
            value={chat}
          />
        </div>
        <input type={"submit"} value={"의견 보내기"} />
      </form>
    </div>
  );
}

export default Chat;
