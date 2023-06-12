import React from "react";
import styled from "styled-components";
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
      queryClient.invalidateQueries("getFeedAxios");
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
        <ProfileImg src={data.profileImgUrl} />
        <FlexWrap>
          {/* <UserPositionText>
            {user.totalLoveCnt || user.loveCnt}
            {data.role}
          </UserPositionText> */}
          <UserNickName>{data.nickName}</UserNickName>
          <UserPosition>
            <HeartButton
              like={data.loveCheck}
              onClick={() => {
                likeButtonHandler(data.photoId);
              }}
            />
            <HeartCount>{data.loveCnt}</HeartCount>
          </UserPosition>
        </FlexWrap>
      </CardHeader>
      <ContentBox>
        {data.content === "undefined" ? null : data.content}
      </ContentBox>
      <HashTagContainer>
        {data.tag_photoList.map((item) => {
          return <HashTag key={item.tagId}>{item.tag}</HashTag>;
        })}
      </HashTagContainer>
    </CardDesign>
  );
}

export default FeedCard;

const ContentBox = styled.div`
  padding: 10px;
`;

const HashTagContainer = styled.div`
  padding: 10px;
  display: flex;
  gap: 5px;
`;

const HashTag = styled.div`
  background-color: #514073;
  color: white;
  border: 1px solid black;
  border-radius: 50px;
  padding: 7px;
`;

const CardDesign = styled.div`
  border-radius: 5px;
  margin-top: 15px;
  flex-grow: 1;
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

const HeartCount = styled.div`
  margin-left: 8px;
`;

const SliderWrapper = styled.div`
  position: relative;
  background-color: #fff;
`;

const CardProfileImg = styled.div`
  width: 100%;
  height: 0;
  padding-bottom: 100%;
  border-radius: 12.69px;
  object-fit: cover;
  background-image: url(${(props) => props.src});
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  background-color: #bbbbbb;
  cursor: pointer;

  position: relative;
`;
