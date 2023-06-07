import React from "react";
import styled from "styled-components";
import BoardItem from "../components/BoardItem";
import { mypage } from "../apis/mypage/mypage";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import MyPageTabs from "../components/MyPageTabs";
import MyPageProfile from "../components/MyPageProfile";
import LoadingSpinner from "../components/LoadingSpinner";

const MyPage = () => {
  const { hostId } = useParams();
  // console.log(hostId);

  const { isError, isLoading, data } = useQuery(
    ["mypage", hostId],
    () => mypage(hostId),
    {
      enabled: hostId !== undefined,
    }
  );

  if (isLoading) {
    return <h1>로딩 중입니다(oﾟvﾟ)ノ</h1>;
    return <LoadingSpinner />;
  }

  if (isError) {
    return <h1>오류(⊙ˍ⊙)</h1>;
  }
  // console.log(data);
  return (
    <>
      <MyPageTabs />
      <PageContainer>
        <ContentContainer>
          <MyPageProfile />
          <Container>
            <WorkSection>
              <Work>나의 작업물</Work>
              <WorkList>
                {data.photoList.slice(0, 10).map((item, index) => {
                  return <WorkItem key={index} src={item.photoUrl} />;
                })}
              </WorkList>
            </WorkSection>
            <Content>
              <Work>내가 쓴 게시물</Work>
              {data.boardList.slice(0, 2).map((item) => {
                return <BoardItem key={item.boardId} item={item} />;
              })}
            </Content>
          </Container>
        </ContentContainer>
      </PageContainer>
    </>
  );
};

export default MyPage;

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

const WorkSection = styled.div`
  flex-grow: 1;
  margin: 30px;
`;

const Work = styled.h2`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 1rem;
`;

const WorkList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
  justify-items: center;
  align-items: center;
  margin-top: 16px;

  @media (min-width: 1200px) {
    grid-template-columns: repeat(5, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }

  @media (max-width: 480px) {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }
`;

const WorkItem = styled.div`
  width: 100%;
  padding-top: 100%;
  background-image: ${(props) => `url(${props.src})`};
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;

  @media (max-width: 480px) {
    height: 200px;
  }
`;
const Content = styled.div`
  flex-grow: 1;
  margin: 30px;
`;
