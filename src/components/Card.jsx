import React from "react";
import styled from "styled-components";

function Card() {
  return (
    <CardDesign>
      <CardHeader>
        <ProfileImg src="img/monkey_test.jpeg"></ProfileImg>

        <div>
          <UserPostion>Photo</UserPostion>
          <UserNickName>Jun</UserNickName>
        </div>
      </CardHeader>

      <CardProfileImgContainer>
        <CardProfileImg src="img/profile_1.jpeg" />
        <CardProfileImg src="img/profile_2.jpeg" />
        <CardProfileImg src="img/profile_3.jpeg" />
      </CardProfileImgContainer>
    </CardDesign>
  );
}

export default Card;

const CardDesign = styled.div`
  background: black;
  width: 31%;
  height: auto;
  color: white;
  border-radius: 5px;
  flex-grow: 1;
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
  font-size: 23px;
`;

const CardProfileImgContainer = styled.div`
  display: flex;
  gap: 20px;
  justify-content: center;
  padding-bottom: 15px;
`;

const CardProfileImg = styled.div`
  width: calc(30% - 6.67px);
  height: 0;
  padding-bottom: calc(30% - 6.67px);
  background-image: url(${(props) => props.src});
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  border-radius: 5px;
`;
