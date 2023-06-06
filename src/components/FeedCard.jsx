import React from "react";
import styled from "styled-components";
import { AiOutlineHeart } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { useMutation } from "react-query";
import heartAxios from "../apis/feed/heartAxios";
import { useQueryClient } from "react-query";
import HeartButton from "./HeartButton";

function FeedCard({ data, onClick, openFeedDetail }) {
  // 좋아요 버튼
  const queryClient = useQueryClient();
  const likeButtonMutation = useMutation(heartAxios, {
    onSuccess: () => {
      queryClient.invalidateQueries("feedDetailAxios");
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const likeButtonHandler = (photoId) => {
    likeButtonMutation.mutate(photoId);
  };

  const handleCardClick = () => {
    onClick();
  };
  const navigate = useNavigate();
  return (
    <CardDesign>
      <SliderWrapper>
        <CardProfileImg
          src={data.photoUrl}
          onClick={() => {
            handleCardClick();
          }}
        />
      </SliderWrapper>

      <CardHeader>
        <ProfileImg
          src={data.profileImgUrl}
          onClick={() => {
            navigate(`/page/${data.hostId}`);
          }}
        />
        <FlexWrap>
          {/* <UserPositionText>
            {user.totalLoveCnt || user.loveCnt}
            {data.role}
          </UserPositionText> */}
          <UserNickName>{data.nickName}</UserNickName>
          <UserPosition>
            <HeartButton like={data.checkLove} onClick={likeButtonHandler} />
            <HeartCount>{data.loveCnt}</HeartCount>
          </UserPosition>
        </FlexWrap>
      </CardHeader>
      <ContentBox>
        {data.content === "undefined" ? null : data.content}
      </ContentBox>
      <HashTagContainer>
        <HashTag>#모델지망</HashTag>
      </HashTagContainer>
    </CardDesign>
  );
}

export default FeedCard;

const ContentBox = styled.div`
  /* background-color: beige; */
  padding: 10px;
`;

const HashTagContainer = styled.div`
  padding: 10px;
  display: flex;
  gap: 5px;
`;

const HashTag = styled.div`
  background-color: transparent;
  border: 1px solid black;
  border-radius: 50px;
  padding: 7px;
`;

const CardDesign = styled.div`
  width: 270px;
  border-radius: 5px;
  margin-top: 15px;
  /* background-color: bisque; */
  /* @media (min-width: 768px) {
    width: calc(25% - 20px);
  }

  @media (min-width: 1024px) {
    width: calc(25% - 20px);
  }

  @media (min-width: 1440px) {
    width: calc(25% - 20px);
  } */
`;

const CardHeader = styled.div`
  display: flex;
  width: 250px;
  align-items: center;
  margin-top: 10px;
`;

const ProfileImg = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  padding: 10px;
  flex-shrink: 0;
  cursor: pointer;
`;

const FlexWrap = styled.div`
  display: flex;
  align-items: center;
  flex-grow: 1;
`;

const UserNickName = styled.div`
  font-size: 14px;
  font-weight: bold;
  color: black;
  margin-left: 1px;

  @media (max-width: 1024px) {
    font-size: 14px;
  }
`;

const UserPosition = styled.div`
  display: flex;
  margin-left: auto;
  align-items: center;
`;

const HeartIcon = styled.button`
  font-size: 22px;
  cursor: pointer;
  background-color: transparent;
  border: none;
`;

const HeartCount = styled.div`
  margin-left: 8px;
`;

const UserPositionText = styled.span`
  font-size: 16px;
  color: #878787;
`;

const SliderWrapper = styled.div`
  position: relative;
  background-color: #fff;
`;

const CardProfileImg = styled.div`
  position: relative;
  width: 270px;
  height: 270px;
  border-radius: 12.69px;
  background-image: url(${(props) => props.src});
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  cursor: pointer;
`;

const Styled_Slide = styled.div`
  position: relative;
  opacity: 100%;
  border: none;
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
