import React, { useState } from "react";
import styled from "styled-components";
import Card from "../components/Card";
import { useMutation, useQuery } from "react-query";
import { main } from "../apis/main/main";
import LoadingSpinner from "../components/LoadingSpinner";
import { useNavigate } from "react-router-dom";
import MainBoard from "../components/MainBoard";
import banner1 from "../assets/img/배너1.png";
import banner2 from "../assets/img/배너2.png";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function Main() {
  const { isLoading, isError, data } = useQuery("main", main);
  const navigate = useNavigate();
  const banners = [banner1, banner2];
  const settings = {
    dots: false,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2700,
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return <h1>{isError}</h1>;
  }

  if (!data) {
    return null; // 또는 로딩 상태를 표시하는 컴포넌트를 반환하거나, 기본적인 화면 구조를 보여줄 수 있습니다.
  }

  const recommendataion = data.eachRoleUsersList;
  const board = data.boardList;

  return (
    <>
      <MainContainer>
        <SliderWrapper>
          <Styled_Slide {...settings}>
            {banners.map((item) => (
              <MainImg key={item} src={item} />
            ))}
          </Styled_Slide>
        </SliderWrapper>
        {/* <MainImg src={banner2}></MainImg> */}
        <MainBody>
          {/* 당신을 위한 맞춤 추천 카테고리 */}
          <CategoryContainer>
            <CardGroupName>
              <CardName>For You</CardName>
              <MoreButton
                onClick={() => {
                  navigate("/feeds");
                }}
              >
                더보기 ▶
              </MoreButton>
            </CardGroupName>
            <CardContainer>
              {recommendataion?.map((item) => {
                return <Card key={item.userId} user={item} />;
              })}
            </CardContainer>
          </CategoryContainer>
          <CategoryContainer>
            <CardGroupName>
              <CardName>Join with me</CardName>
              <MoreButton
                onClick={() => {
                  navigate("/board");
                }}
              >
                더보기 ▶
              </MoreButton>
            </CardGroupName>
            <BoardContainer>
              {board?.map((item) => {
                return <MainBoard key={item.boardId} board={item} />;
              })}
            </BoardContainer>
          </CategoryContainer>
        </MainBody>
      </MainContainer>
    </>
  );
}

export default Main;

const MainContainer = styled.div`
  /*   margin: auto 100px; */
`;

const SliderWrapper = styled.div`
  position: relative;
  background-color: #fff;
  overflow-x: hidden;
`;

const Styled_Slide = styled(Slider)`
  position: relative;
  opacity: 100%;
  border: none;
  z-index: 1;
`;

const MainImg = styled.img`
  width: 100%;
  margin-bottom: 30px;
`;

const MainBody = styled.div`
  margin: auto 100px;
`;

const CategoryContainer = styled.div`
  margin-bottom: 40px;
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
  @media (max-width: 768px) {
    font-size: 20px;
  }
`;

const MoreButton = styled.div`
  border: none;
  color: #515151;
  cursor: pointer;
  font-weight: 600;
  @media (max-width: 768px) {
    font-size: 12px;
  }
`;

const CardContainer = styled.div`
  flex-wrap: wrap;
  display: flex;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;
const BoardContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  @media (max-width: 768px) {
    grid-template-columns: repeat(1, 1fr);
  }
`;
