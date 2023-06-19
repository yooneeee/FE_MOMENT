import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useMutation } from "react-query";
import heartAxios from "../apis/feed/heartAxios";
import { useQueryClient } from "react-query";
import HeartButton from "./HeartButton";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";

function FeedCard({ data, onClick, openFeedDetail }) {
  // 좋아요 버튼
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
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
    if (isLoggedIn) {
      likeButtonMutation.mutate(photoId);
    } else {
      Swal.fire({
        icon: "warning",
        title: "회원 전용 서비스!",
        text: `로그인이 필요한 서비스입니다🙏`,
        confirmButtonText: "확인",
      });
    }
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
        {data.content && data.content.length > 50
          ? data.content.slice(0, 50) + "..."
          : data.content}
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
  padding: 10px 20px;
  white-space: pre-wrap;
  word-wrap: break-word;
`;

const HashTagContainer = styled.div`
  padding: 10px 17px 20px;
  display: flex;

  flex-wrap: wrap;
  gap: 5px;
`;

const HashTag = styled.div`
  background-color: #514073;
  color: white;
  border: none;
  border-radius: 50px;
  padding: 7px;
  font-size: 14px;
  @media (max-width: 1200px) {
    font-size: 11px;
  }
  @media (max-width: 768px) {
    font-size: 9px;
  }
`;

const CardDesign = styled.div`
  border-radius: 12.69px;
  margin-top: 15px;
  flex-grow: 1;
  width: 100%;
  overflow: hidden;
  box-shadow: rgb(135, 135, 135) 0px 4px 7px;

  &:hover {
    transform: translateY(-10px);
    transition: transform 1s ease;
    box-shadow: rgb(135, 135, 135) 0px 6px 10px;
  }

  &:not(:hover) {
    transform: translateY(0);
    transition: transform 1s ease;
    box-shadow: rgb(135, 135, 135) 0px 4px 7px;
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  margin-top: 10px;
  /* padding: 0 20px; */
  padding: 5px 20px 5px 20px;
`;

const ProfileImg = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
  cursor: pointer;
  margin-right: 3%;
  @media (max-width: 768px) {
    width: 30px;
    height: 30px;
  }
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
  object-fit: cover;
  background-image: url(${(props) => props.src});
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  background-color: #bbbbbb;
  cursor: pointer;
`;
