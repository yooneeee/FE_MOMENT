import React, { useRef, useState } from "react";
import styled from "styled-components";

function MainBoard({ board }) {
  if (!board) {
    return null;
  }
  return (
    <CardDesign>
      <CardProfileImg src={board.boardImgUrl} />
      <CardContent>
        <UserInfo>
          <UserName>{board.nickName}</UserName>
          <UserPosition>{board.role}</UserPosition>
        </UserInfo>

        <BoardTitle>{board.title}</BoardTitle>
      </CardContent>
    </CardDesign>
  );
}

export default MainBoard;

const CardDesign = styled.div`
  background: #585858;
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

const CardContent = styled.div`
  padding: 16px;
`;

const UserInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const UserName = styled.span`
  font-size: 16px;
  font-weight: bold;
`;

const UserPosition = styled.div`
  color: #a9a9a9;
  font-size: 12px;
  margin-bottom: 8px;
`;

const BoardTitle = styled.span`
  font-size: 18px;
`;

const CardProfileImg = styled.div`
  width: 100%;
  padding-bottom: 100%;
  background-image: url(${(props) => props.src});
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  cursor: pointer;
`;

/*  return (
    <CardDesign>
      <CardProfileImg src={board.boardImgUrl} />

      <CardHeader>
        <User>
          <UserNickName>{board.nickName}</UserNickName>
          <UserPostion> {board.role} </UserPostion>
        </User>
        <span>{board.title}</span>
      </CardHeader>
    </CardDesign>
  );
}

export default MainBoard;

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
  flex-direction: column;
  padding: 10px;

`;
const User = styled.div`
  gap: 10px;
  display: flex;
  align-items: center;
`;
const UserPostion = styled.div`
  color: #a9a9a9;
  font-size: 12px;
`;

const UserNickName = styled.div`
  font-size: 20px;
`;

const CardProfileImg = styled.div`
  width: 100%;
  padding-bottom: 100%;
  background-image: url(${(props) => props.src});
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  cursor: pointer;
`;
 */
