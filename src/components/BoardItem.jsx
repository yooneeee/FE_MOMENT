import React, { useEffect, useState } from "react";
import styled from "styled-components";

function BoardItem({ item, onClick }) {
  const [timeDifference, setTimeDifference] = useState(null);
  const getTimeDifference = (createdTime) => {
    const serverTime = new Date(createdTime);
    const currentTime = new Date();

    const timeDiff = Math.floor((currentTime - serverTime) / (1000 * 60)); // 분 단위로 시간 차이 계산

    if (timeDiff < 60) {
      return `${timeDiff}분 전`;
    } else {
      const hoursDiff = Math.floor(timeDiff / 60);
      return `${hoursDiff}시간 전`;
    }
  };

  useEffect(() => {
    const diff = getTimeDifference(item.createdTime);
    setTimeDifference(diff);
  }, [item.createdTime]);

  return (
    <Item key={item.boardId} onClick={onClick}>
      <ImageContainer img={item.boardImgUrl} />
      <ContentContainer>
        <Title>{item.title}</Title>
        <PhotographerInfo>
          <PhotographerRole>{item.role}</PhotographerRole>
          <PhotographerName>{item.nickName}</PhotographerName>
        </PhotographerInfo>
        <HashTagContainer>
          {item.tag_boardList.map((tags) => {
            return <HashTag>{tags}</HashTag>;
          })}
        </HashTagContainer>
        <MeetInfo>
          <CreatedDate>{getTimeDifference(item.createdTime)}</CreatedDate>
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
  /* border: 3px solid #514073; */
  border-radius: 5px;
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
  font-weight: 600;
  font-size: 21px;
  margin-bottom: 8px;
`;

const PhotographerInfo = styled.div`
  margin-top: 10px;
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  font-size: 14px;
`;

const PhotographerName = styled.div`
  font-weight: 500;
`;

const PhotographerRole = styled.div`
  font-weight: 500;
  color: #666;
  margin-right: 8px;
`;

const MeetInfo = styled.div`
  display: flex;
  align-items: center;
  margin-top: 50px;
  @media (max-width: 768px) {
    margin-top: 20px;
  }
`;

const CreatedDate = styled.div`
  color: #666;
  font-size: 14px;
`;

const HashTagContainer = styled.div`
  padding-top: 10px;
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
