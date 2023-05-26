import React from "react";
import styled from "styled-components";

function FeedDetail() {
  return (
    <FeedContainer>
      <ImgBackground>
        <DetailImg src="img/profile_1.jpeg"></DetailImg>
        <Footer>
          <CardHeader>
            <ProfileImg src="img/monkey_test.jpeg"></ProfileImg>
            <div>
              <UserPostion>Photo</UserPostion>
              <UserNickName>Jun</UserNickName>
            </div>
          </CardHeader>
        </Footer>
      </ImgBackground>
    </FeedContainer>
  );
}
export default FeedDetail;

const FeedContainer = styled.div`
  width: 40%;
  background: #eee;
  margin: auto;
  height: auto;
  flex-wrap: wrap;
`;

const ImgBackground = styled.div`
  height: calc(100vh - 100px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-image: url(${(props) => props.src});
  background-repeat: no-repeat;
  background-size: cover;

  flex-direction: column;
`;

const Footer = styled.div`
  background: #282828;
  width: 100%;
  padding: 15px;
  color: white;
  border-top-left-radius: 25px;
  border-top-right-radius: 25px;
`;

const DetailImg = styled.img`
  width: 100%;
  height: 0;
  padding-bottom: 100%;
  background-image: url(${(props) => props.src});
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
`;

const ProfileImg = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 70%;
  object-fit: cover;
  padding: 10px;
  flex-shrink: 0;
`;

const UserPostion = styled.div`
  color: #a9a9a9;
  font-size: 14px;
`;

const UserNickName = styled.div`
  font-size: 23px;
`;
