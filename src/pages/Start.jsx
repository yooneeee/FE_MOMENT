import React from "react";
import styled from "styled-components";
import InitialNav from "../components/InitialNav";
import { useNavigate } from "react-router-dom";

function Start() {
  const navigate = useNavigate();
  return (
    <PageContainer>
      <NavigationBar>
        <InitialNav />
      </NavigationBar>
      <ContentContainer>
        <DescriptionContainer>
          <p>누구나 모델과 사진 작가가 될 수 있다!</p>
          <Des>
            만나는 순간, 사진 찍는 순간, 당신의 모든 순간 모먼트와 함께 하세요.
          </Des>
          <StartButton
            onClick={() => {
              navigate("/Main");
            }}
          >
            지금 시작하기
          </StartButton>
        </DescriptionContainer>
        <PostListSection>
          <PostImage src="https://t1.daumcdn.net/cfile/tistory/125A09345096470417" />
          <PostImage src="https://t1.daumcdn.net/cfile/tistory/125A09345096470417" />
          <PostImage src="https://t1.daumcdn.net/cfile/tistory/125A09345096470417" />
          <PostImage src="https://t1.daumcdn.net/cfile/tistory/125A09345096470417" />
          <PostImage src="https://t1.daumcdn.net/cfile/tistory/125A09345096470417" />
          <PostImage src="https://t1.daumcdn.net/cfile/tistory/125A09345096470417" />
          <PostImage src="https://t1.daumcdn.net/cfile/tistory/125A09345096470417" />
          <PostImage src="https://t1.daumcdn.net/cfile/tistory/125A09345096470417" />
          <PostImage src="https://t1.daumcdn.net/cfile/tistory/125A09345096470417" />
        </PostListSection>
      </ContentContainer>
    </PageContainer>
  );
}

export default Start;

const PageContainer = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const NavigationBar = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 50px;
`;

const Des = styled.p`
  font-size: 30px;
  color: #333;
`;

const StartButton = styled.button`
  border: none;
  padding: 20px 50px;
  border-radius: 60px;
  background-color: #df8383;
  color: white;
  font-size: 25px;
  font-weight: bold;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 50px; /* 네비게이션 바 높이(50px) 여백 */
  padding: 10px;
  height: calc(
    100vh - 60px
  ); /* 전체 높이에서 (네비게이션 바의 높이+패딩)를 빼서 설정 */
  box-sizing: border-box;

  @media (min-width: 769px) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
`;
const DescriptionContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 80px;
  flex-basis: 50%;
  text-align: center;
  font-size: 50px;
  font-weight: bold;

  @media (max-width: 768px) {
    order: 1;
    flex-basis: 100%;
    gap: 40px;
  }
`;

const PostListSection = styled.div`
  flex-basis: 50%;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 10px;
  padding: 10px;

  @media (max-width: 768px) {
    order: 1;
    flex-basis: 100%;
    grid-template-columns: repeat(2, 1fr); /* 모바일에서 2열로 변경 */
    justify-items: center;
    margin-top: 20px;
  }

  @media (max-width: 480px) {
    grid-template-columns: repeat(
      1,
      1fr
    ); /* 화면이 480px 이하일 때, 1열로 변경 */
  }
`;

const PostImage = styled.img`
  width: calc(100%);
  height: calc((100vh - 100px) / 3);
  object-fit: cover;

  @media (max-width: 768px) {
    width: 100%;
    height: calc((100vh - 100px) / 3);
  }

  @media (max-width: 480px) {
    width: 100%;
    height: calc((100vh - 100px) / 2);
  }
`;
