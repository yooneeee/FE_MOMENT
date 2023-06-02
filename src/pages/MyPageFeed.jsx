import React from "react";
import styled from "styled-components";
import MyPageTabs from "../components/MyPageTabs";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { mypage } from "../apis/mypage/mypage";

function MyPageFeed() {
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
      <WorkSection>
        <Work>나의 작업물</Work>
        <WorkList>
          {data.photoList.map((item, index) => {
            return <WorkItem key={index} src={item.photoUrl} />;
          })}
        </WorkList>
      </WorkSection>
    </>
  );
}

export default MyPageFeed;

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
