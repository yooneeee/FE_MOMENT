import React, { useRef, useState } from "react";
import styled from "styled-components";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useNavigate } from "react-router-dom";

function Card({ user }) {
  /*   const photoList = Array.isArray(user.photoList)
    ? user.photoList.map((item, index) => ({ ...item, index }))
    : [];
  console.log("포토리스트", photoList); */
  const navigate = useNavigate();
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
  };

  if (!user) {
    return null;
  }
  return (
    <CardDesign>
      <SliderWrapper>
        <Styled_Slide {...settings}>
          {user.photoList?.map((item) => (
            <CardProfileImg key={item.photoUrl} src={item.photoUrl} />
          ))}
        </Styled_Slide>
      </SliderWrapper>
      <CardHeader>
        <ProfileImg
          src={user.profileUrl}
          onClick={() => {
            navigate(`/page/${user.userId}`);
          }}
        ></ProfileImg>
        <div>
          <UserPostion> {user.role} </UserPostion>
          <UserNickName>{user.nickName}</UserNickName>
        </div>
      </CardHeader>
    </CardDesign>
  );
}

export default Card;

const Styled_Slide = styled(Slider)`
  position: relative;
  z-index: 1;
  .slick-prev,
  .slick-next {
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 2;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    border-radius: 50%;
    font-size: 20px;
  }
  .slick-prev {
    left: 3px;
  }
  .slick-next {
    right: 3px;
  }
`;

const CardDesign = styled.div`
  background: black;
  width: 100%;
  color: white;
  border-radius: 5px;
  flex-grow: 1;

  @media (min-width: 768px) {
    width: calc(25% - 20px);
    margin: 10px;
  }

  @media (min-width: 1024px) {
    width: calc(25% - 20px);
    margin: 10px;
  }

  @media (min-width: 1440px) {
    width: calc(25% - 20px);
    margin: 10px;
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
`;

const ProfileImg = styled.img`
  width: 70px;
  height: 70px;
  border-radius: 70%;
  object-fit: cover;
  padding: 15px;
  flex-shrink: 0;
`;

const UserPostion = styled.div`
  color: #a9a9a9;
  font-size: 14px;
`;

const UserNickName = styled.div`
  font-size: 18px;

  @media (max-width: 1024px) {
    font-size: 14px;
  }
`;

const SliderWrapper = styled.div`
  position: relative;
`;

const CardProfileImgContainer = styled.div`
  display: flex;
  gap: 20px;
  justify-content: center;
  padding-bottom: 15px;
  margin-top: 10px;
`;

const CardProfileImg = styled.div`
  position: relative;
  width: 100%;
  padding-bottom: 100%;
  background-image: url(${(props) => props.src});
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  cursor: pointer;
`;

const ArrowButton = styled.div`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 2;
`;

const PrevArrow = ({ onClick }) => (
  <ArrowButton className="slick-prev" onClick={onClick}></ArrowButton>
);

const NextArrow = ({ onClick }) => (
  <ArrowButton className="slick-next" onClick={onClick}></ArrowButton>
);
