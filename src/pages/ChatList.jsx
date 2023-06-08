import React from "react";
import styled from "styled-components";
import MyPageTabs from "../components/MyPageTabs";
import { ChattingList } from "../apis/mypage/chatting";
import { useQuery } from "react-query";

function ChatList() {
  const { isError, isLoading, data } = useQuery("ChattingList", ChattingList);
  console.log("채팅목록", data);

  if (isLoading) {
    return <h1>로딩 중입니다(oﾟvﾟ)ノ</h1>;
  }

  if (isError) {
    console.log("오류", isError);
    return <h1>오류(⊙ˍ⊙)</h1>;
  }

  /* 배열안의 객체 값 가져오기 */
  if (!data || !data[0]) {
    return <h1>데이터를 찾을 수 없습니다.</h1>;
  }

  const receiverProfileImg = data[0].receiverProfileImg;
  const receiverNickName = data[0].receiverNickName;

  return (
    <>
      <MyPageTabs pageName={"채팅목록"} />
      <img src={receiverProfileImg} />
      <div>{receiverNickName}</div>
      {/* <div>{data.message}</div> */}
    </>
  );
}

export default ChatList;
