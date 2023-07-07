import React, { Suspense, useEffect, useState } from "react";
import styled from "styled-components";
import { useQuery } from "react-query";
import { main } from "../apis/main/main";
import LoadingSpinner from "../components/LoadingSpinner";
import { useNavigate } from "react-router-dom";
import banner1 from "../assets/img/배너1.png";
import banner2 from "../assets/img/배너2.png";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import LazyLoad from "react-lazyload";
const Card = React.lazy(() => import("../components/Card"));
const MainBoard = React.lazy(() => import("../components/MainBoard"));

function Main() {
  const [areImagesLoaded, setImagesLoaded] = useState(false);
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
  useEffect(() => {
    const imagePromises = banners.map((item) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = resolve;
        img.onerror = reject;
        img.src = item;
      });
    });

    Promise.all(imagePromises)
      .then(() => {
        setImagesLoaded(true);
      })
      .catch((error) => {
        console.error("Failed to load images:", error);
      });
  }, []);

  if (!areImagesLoaded) {
    return <LoadingSpinner />;
  }
  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return <h1>{isError}</h1>;
  }

  if (!data) {
    return null;
  }

  const recommendataion = data.eachRoleUsersList;
  const board = data.boardList;
  const handleMoreRecommendations = () => {
    navigate("/feeds");
  };

  const handleMoreBoard = () => {
    navigate("/board");
  };
  return (
    <>
      <MainContainer>
        <SliderWrapper>
          <Styled_Slide {...settings}>
            {banners.map((item) => (
              <LazyLoad key={item} height={400}>
                <MainImg
                  src={item}
                  fetchpriority="high"
                  alt="메인 배너 이미지"
                />
              </LazyLoad>
            ))}
          </Styled_Slide>
        </SliderWrapper>
        <MainBody>
          <CategoryContainer>
            <CardGroupName>
              <CardName>For You</CardName>
              <MoreButton onClick={handleMoreRecommendations}>
                더보기 ▶
              </MoreButton>
            </CardGroupName>
            <CardContainer>
              <Suspense fallback={<LoadingSpinner />}>
                {recommendataion?.map((item) => {
                  return <Card key={item.userId} user={item} />;
                })}
              </Suspense>
            </CardContainer>
          </CategoryContainer>
          <CategoryContainer>
            <CardGroupName>
              <CardName>Join with me</CardName>
              <MoreButton onClick={handleMoreBoard}>더보기 ▶</MoreButton>
            </CardGroupName>
            <BoardContainer>
              <Suspense fallback={<LoadingSpinner />}>
                {board?.map((item) => {
                  return <MainBoard key={item.boardId} board={item} />;
                })}
              </Suspense>
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
  margin: auto 150px;
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
  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;
const BoardContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 768px) {
    grid-template-columns: repeat(1, 1fr);
  }
`;
