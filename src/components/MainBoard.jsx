import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

function MainBoard({ board }) {
  const navigate = useNavigate();
  if (!board) {
    return null;
  }
  const date = new Date(board.createdTime);
  const options = { year: "numeric", month: "2-digit", day: "2-digit" };
  const formattedDate = date.toLocaleDateString(undefined, options); // yyyy.MM.dd 형식으로 포맷팅

  return (
    <CardDesign
      onClick={() => {
        navigate(`/board/${board.boardId}`);
      }}
    >
      <CardProfileImg src={board.boardImgUrl} />
      <CardContent>
        <UserInfo>
          <UserProfile src={board.profileImgUrl}></UserProfile>
          <FlexWrap>
            <UserName>{board.nickName}</UserName>
            {/*  <UserPosition>{board.role}</UserPosition> */}
            <UserPosition>♡{board.totalLoveCnt}</UserPosition>
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
    transform: scale(1.05);
  }
  /*     width: calc(25% - 20px);
    margin: 10px;
  } 

  @media (min-width: 1024px) {
    width: calc(25% - 20px);
    margin: 10px;
  }

  @media (min-width: 1440px) {
    width: calc(25% - 20px);
    margin: 10px;
  }*/
`;

const CardContent = styled.div`
  padding: 16px;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  font-size: 16px;
  font-weight: bold;
`;

const FlexWrap = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-grow: 1;
`;
const MeetingInfo = styled.div`
  margin-top: 12px;
  display: flex;
  font-weight: bold;
  gap: 20px;
  align-items: center;
  font-size: 16px;
  color: #858585;
`;
const UserProfile = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
  margin-right: 10px;
`;
const UserName = styled.span``;

const UserPosition = styled.span``;

const BoardTitle = styled.span`
  font-size: 18px;
  font-weight: bold;
`;
const BoardLocation = styled.span``;
const BoardDate = styled.span``;

const CardProfileImg = styled.div`
  width: 100%;
  padding-bottom: 100%;
  border-radius: 12.69px;
  background-image: url(${(props) => props.src});
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  cursor: pointer;
`;
