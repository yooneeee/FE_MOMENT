import React from "react";
import styled from "styled-components";
import MyPageTabs from "../components/MyPageTabs";
import BoardItem from "../components/BoardItem";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { mypage } from "../apis/mypage/mypage";

function MyPageBoard() {
  const { hostId } = useParams();
  console.log(hostId);

  const { isError, isLoading, data } = useQuery(["mypage", mypage], () =>
    mypage(hostId)
  );

  if (isLoading) {
    return <h1>로딩 중입니다..!</h1>;
  }

  if (isError) {
    return <h1>오류ㅜ.ㅜ</h1>;
  }
  console.log(data);

  return (
    <>
      <MyPageTabs />
      <Content>
        <Work>내가 쓴 게시물</Work>
        {data.boardList.map((item) => {
          return <BoardItem key={item.boardId} item={item} />;
        })}
      </Content>
    </>
  );
}

export default MyPageBoard;

const Content = styled.div`
  flex-grow: 1;
  margin: 30px;
`;
const Work = styled.h2`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 1rem;
`;
