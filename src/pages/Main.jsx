import React from "react";
import styled from "styled-components";
import Card from "../components/Card";
import { useQuery } from "react-query";
import { main } from "../apis/main/main";

function Main() {
  // 서버 통신
  const { isLoading, isError, data } = useQuery("main", main);
  /*   console.log(data); */
  if (isLoading) {
    return <h1>로딩 중입니다..!</h1>;
  }

  if (isError) {
    return <h1>{isError}</h1>;
  }
  return (
    <>
      <div>
        <MainImg src="img/mainImg_test.jpeg"></MainImg>
      </div>

      <MainBody>
        {/* 당신을 위한 맞춤 추천 카테고리 */}
        <CategoryContainer>
          <CardGroupName>
            <CardName>For You</CardName>
            <MoreButton>더보기</MoreButton>
          </CardGroupName>

          <CardContainer>
            {data?.map((item) => {
              return <Card key={item.userId} user={item} />;
            })}
          </CardContainer>
        </CategoryContainer>

        {/* 모델 구직 카테고리 */}
        <CategoryContainer>
          <CardGroupName>
            <CardName>Model</CardName>
            <MoreButton>더보기</MoreButton>
          </CardGroupName>

          <CardContainer>
            <Card />
            <Card />
            <Card />
          </CardContainer>
        </CategoryContainer>

        {/* 작가 구인 카테고리 */}
        <CategoryContainer>
          <CardGroupName>
            <CardName>Photographer</CardName>
            <MoreButton>더보기</MoreButton>
          </CardGroupName>

          <CardContainer>
            <Card />
            <Card />
            <Card />
          </CardContainer>
        </CategoryContainer>
      </MainBody>
    </>
  );
}

export default Main;

const MainImg = styled.img`
  width: 100%;
`;

const MainBody = styled.div`
  padding: 70px 90px;
`;

const CategoryContainer = styled.div`
  margin-bottom: 60px;
`;

const CardGroupName = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 20px;
`;

const CardName = styled.p`
  font-size: 25px;
  font-weight: 700;
`;

const MoreButton = styled.div`
  border: none;
  color: #0096c6;
  cursor: pointer;
  font-weight: 600;
`;

const CardContainer = styled.div`
  gap: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
`;
