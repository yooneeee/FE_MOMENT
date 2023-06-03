import React from "react";
import styled from "styled-components";

function BoardItem({ item, onClick }) {
  return (
    <Item key={item.boardId} onClick={onClick}>
      <ImageContainer img={item.boardImgUrl} />
      <ContentContainer>
        <Title>{item.title}</Title>
        <PhotographerInfo>
          <PhotographerName>{item.role}</PhotographerName>
          <div>{item.nickName}</div>
        </PhotographerInfo>
        <MeetInfo>
          {/* <Location>서울 중구</Location> */}
          <Date>{item.createdTime}</Date>
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
  cursor: pointer;

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
  background-image: url(${(props) => props.img});
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
