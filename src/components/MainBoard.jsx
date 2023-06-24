import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import { RiEmotionHappyLine } from "@react-icons/all-files/ri/RiEmotionHappyLine";

function MainBoard({ board }) {
  const navigate = useNavigate();
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  if (!board) {
    return null;
  }
  const date = new Date(board.createdTime);
  const options = { year: "numeric", month: "2-digit", day: "2-digit" };
  const formattedDate = date.toLocaleDateString(undefined, options);

  return (
    <CardDesign
      onClick={() => {
        if (isLoggedIn) {
          navigate(`/board/${board.boardId}`);
        } else {
          Swal.fire({
            icon: "warning",
            title: "회원 전용 서비스!",
            text: `더 많은 서비스를 이용하시려면 로그인해주세요🙏`,
            confirmButtonText: "확인",
          });
        }
      }}
    >
      <CardProfileImg src={board.boardImgUrl} alt="Profile Image" />
      <CardContent>
        <UserInfo>
          <UserProfile src={board.hostProfileUrl}></UserProfile>
          <FlexWrap>
            <UserName>{board.nickName}</UserName>
            <UserPosition>
              <RiEmotionHappyLine />
              <UserPositionText>{board.totalLoveCnt}</UserPositionText>
            </UserPosition>
          </FlexWrap>
        </UserInfo>
        <BoardTitle>{board.title}</BoardTitle>
        <MeetingInfo>
          <BoardLocation>{board.location}</BoardLocation>
          <BoardDate>{formattedDate}</BoardDate>
        </MeetingInfo>
      </CardContent>
    </CardDesign>
  );
}

export default MainBoard;

const CardDesign = styled.div`
  color: black;
  border-radius: 5px;
  flex-grow: 1;
  width: 100%;
  cursor: pointer;
  &:hover {
    transform: translateY(-10px);
    transition: transform 1s ease;
    cursor: pointer;
  }

  &:not(:hover) {
    transform: translateY(0);
    transition: transform 1s ease;
  }
`;

const CardContent = styled.div`
  padding: 16px;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  font-size: 16px;
`;

const FlexWrap = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-grow: 1;
`;
const MeetingInfo = styled.div`
  margin-top: 20px;
  display: flex;
  font-weight: bold;
  gap: 20px;
  align-items: center;
  font-size: 12px;
  color: #858585;
`;
const UserProfile = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
  margin-right: 10px;
  @media (max-width: 1200px) {
    width: 23px;
    height: 23px;
  }
`;
const UserName = styled.span`
  font-weight: bold;
  font-size: 14px;
`;

const UserPosition = styled.div`
  display: flex;
  align-items: center;
`;

const UserPositionText = styled.span`
  font-size: 16px;
  margin-left: 5px;
`;
const BoardTitle = styled.span`
  font-size: 16px;
  font-weight: 500;
`;
const BoardLocation = styled.span``;

const BoardDate = styled.div``;

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
`;
