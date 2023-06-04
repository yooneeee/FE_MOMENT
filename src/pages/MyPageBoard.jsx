import React from "react";
import styled from "styled-components";
import MyPageTabs from "../components/MyPageTabs";
import BoardItem from "../components/BoardItem";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "react-query";
import { mypage } from "../apis/mypage/mypage";
import MyPageProfile from "../components/MyPageProfile";

function MyPageBoard() {
  const { hostId } = useParams();
  console.log(hostId);

  const { isError, isLoading, data } = useQuery(["mypage", mypage], () =>
    mypage(hostId)
  );

  if (isLoading) {
    return <h1>로딩 중입니다(oﾟvﾟ)ノ</h1>;
  }

  if (isError) {
    return <h1>오류(⊙ˍ⊙)</h1>;
  }
  console.log(data);

  return (
    <>
      <MyPageTabs />
      <PageContainer>
        <ContentContainer>
          <MyPageProfile />
          <Container>
            <Content>
              <Work>내가 쓴 게시물</Work>
              {data.boardList.map((item) => {
                return <BoardItem key={item.boardId} item={item} />;
              })}
            </Content>
          </Container>
        </ContentContainer>
      </PageContainer>
    </>
  );
}

export default MyPageBoard;

const PageContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f5f5f5;
  padding: 20px;
`;
const Container = styled.div`
  width: 100%;
`;
const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  max-width: 1200px;
  margin-top: 80px;
  @media (min-width: 769px) {
    flex-direction: row;
    align-items: flex-start;
  }
`;

const Work = styled.h2`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 1rem;
`;

const Content = styled.div`
  flex-grow: 1;
  margin: 30px;
`;
