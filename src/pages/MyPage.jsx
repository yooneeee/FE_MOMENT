import React from "react";
import styled from "styled-components";
import BoardItem from "../components/BoardItem";
import { mypage } from "../apis/mypage/mypage";
import { useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import MyPageTabs from "../components/MyPageTabs";
import MyPageProfile from "../components/MyPageProfile";
import LoadingSpinner from "../components/LoadingSpinner";
import FeedDetail from "../components/FeedDetail";
import { useState } from "react";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";

const MyPage = () => {
  const navigate = useNavigate();
  const { hostId } = useParams();

  const userId = useSelector((state) => state.user.userId);
  const mine = hostId == userId;

  const { isError, isLoading, data } = useQuery(
    ["mypage", hostId],
    () => mypage(hostId),
    {
      enabled: hostId !== undefined,
    }
  );

  // 모달 제어
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const [feedDetailOpen, setFeedDetailOpen] = useState([]);

  const openFeedDetail = (photoId) => {
    if (isLoggedIn) {
      setFeedDetailOpen((prevOpen) => [...prevOpen, photoId]);
    } else {
      Swal.fire({
        icon: "warning",
        title: "회원 전용 서비스!",
        text: `로그인이 필요한 서비스입니다🙏`,
        confirmButtonText: "확인",
      });
    }
  };

  const closeFeedDetail = (photoId) => {
    setFeedDetailOpen((prevOpen) => prevOpen.filter((id) => id !== photoId));
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return <h1>오류(⊙ˍ⊙)</h1>;
  }
  return (
    <>
      {mine && <MyPageTabs pageName={"전체보기"} />}
      <PageContainer>
        <ContentContainer>
          <ProfileContainer>
            <MyPageProfile />
          </ProfileContainer>
          <Container>
            <WorkSection>
              <Work>{mine ? "나의 작업물" : `${data.nickName}의 작업물`}</Work>
              <WorkList>
                {data.photoList.slice(0, 10).map((item, index) => {
                  const isOpen = feedDetailOpen.includes(item.photoId);
                  return (
                    <>
                      <WorkItem
                        key={index}
                        src={item.photoUrl}
                        onClick={() => {
                          openFeedDetail(item.photoId);
                        }}
                      />
                      {isOpen && (
                        <FeedDetail
                          open={() => openFeedDetail(item.photoId)}
                          close={() => closeFeedDetail(item.photoId)}
                          photoId={item.photoId}
                        />
                      )}
                    </>
                  );
                })}
              </WorkList>
            </WorkSection>
            <Content>
              <Work>
                {mine ? "내가 쓴 게시물" : `${data.nickName}'s 게시물`}
              </Work>
              {data.boardList.slice(0, 2).map((item) => {
                return (
                  <BoardItem
                    key={item.boardId}
                    item={item}
                    onClick={() => {
                      navigate(`/board/${item.boardId}`);
                    }}
                  />
                );
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

const ProfileContainer = styled.div`
  width: 550px;
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
  margin-top: 40px;
  @media (min-width: 769px) {
    flex-direction: row;
    align-items: flex-start;
  }
`;

const WorkSection = styled.div`
  flex-grow: 1;
  margin-left: 30px;
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
  cursor: pointer;
  width: 100%;
  padding-top: 100%;
  border-radius: 7px;
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
