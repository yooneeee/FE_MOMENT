import React from "react";
import { styled } from "styled-components";

function BoardItem() {
  return (
    <Item>
      <ImageContainer />
      <ContentContainer>
        <Title>서울에서 작업하실 모델 찾아요!</Title>
        <PhotographerInfo>
          <PhotographerName>Photographer</PhotographerName>
          <div>닉네임</div>
        </PhotographerInfo>
        <MeetInfo>
          <Location>서울 중구</Location>
          <Date>2023.08.08</Date>
        </MeetInfo>
      </ContentContainer>
    </Item>
  );
}

export default BoardItem;

const Item = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 20px 0;
  padding: 16px;
  background-color: #f9f9f9;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 100%;

  @media (min-width: 768px) {
    flex-direction: row;
    align-items: flex-start;
    width: 100%;
  }
`;

const ImageContainer = styled.div`
  width: 200px;
  height: 200px;
  margin-right: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url(https://post-phinf.pstatic.net/MjAxODAyMTZfMTc1/MDAxNTE4NzY4MzY2Mzky.uHl9W4Ck2pCtJpTIRSsmSD_x3RrSJE9TgsAAH6KwBWYg.E5STeiemwcVj5M7BLB5zS5bfD6Ou2GzIK-TBVvn3YIMg.JPEG/%EB%AC%B4%EC%A0%9C-1_%EB%B3%B5%EC%82%AC.jpg);
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 20px;
`;

const Title = styled.div`
  font-weight: bold;
  font-size: 24px;
  margin-bottom: 8px;
`;

const PhotographerInfo = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
`;

const PhotographerName = styled.div`
  font-weight: bold;
  margin-right: 8px;
`;

const MeetInfo = styled.div`
  display: flex;
  align-items: center;
  margin-top: 60px;
  @media (max-width: 768px) {
    margin-top: 20px;
  }
`;

const Location = styled.div`
  color: #666;
  margin-right: 20px;
`;

const Date = styled.div`
  color: #666;
`;
