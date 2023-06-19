import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { IoLocationSharp } from "react-icons/io5";
import { BiDollarCircle } from "react-icons/bi";
import { LuCalendarDays } from "react-icons/lu";
import { FaPen } from "react-icons/fa";

function BoardItem({ item, onClick }) {
  const [timeDifference, setTimeDifference] = useState(null);
  // 오늘 날짜
  const today = new Date();

  const getTimeDifference = (createdTime) => {
    const serverTime = new Date(createdTime);
    const currentTime = new Date();
    const timeDiff = Math.floor((currentTime - serverTime) / (1000 * 60)); // 분 단위로 시간 차이 계산

    if (timeDiff < 60) {
      return `${timeDiff}분 전 작성됨 `;
    } else if (timeDiff >= 60 && timeDiff < 1440) {
      const hoursDiff = Math.floor(timeDiff / 60);
      return `${hoursDiff}시간 전 작성됨 `;
    } else {
      const daysDiff = Math.floor(timeDiff / 1440);
      return `${daysDiff}일 전 작성됨 `;
    }
  };

  const getDDay = (deadLine) => {
    const targetDate = new Date(deadLine);
    const timeDiff = Math.ceil((targetDate - today) / (1000 * 60 * 60 * 24)); // 일 단위로 시간 차이 계산

    if (timeDiff === 0) {
      return "D-day";
    } else if (timeDiff > 0) {
      return `D-${timeDiff}`;
    } else {
      return "마감";
    }
  };
  useEffect(() => {
    const diff = getTimeDifference(item.createdTime);
    setTimeDifference(diff);
  }, [item.createdTime]);

  return (
    <Item key={item.boardId} onClick={onClick}>
      <ImageContainer img={item.boardImgUrl}>
        <DDayInfo isDday={getDDay(item.deadLine) === "D-day"}>
          <p>{getDDay(item.deadLine)}</p>
        </DDayInfo>
      </ImageContainer>
      <ContentContainer>
        <Title>{item.title}</Title>
        <PhotographerInfo>
          <PhotographerRole>{item.role}</PhotographerRole>
          <PhotographerName>{item.nickName}</PhotographerName>
        </PhotographerInfo>
        <LocationInfo>
          <IoLocationSharp style={{ color: "#514073" }} />
          <p>{item.location}</p>
          <BiDollarCircle style={{ color: "#514073" }} />
          <p>{item.pay}</p>
        </LocationInfo>
        <DeadLineInfo>
          <LuCalendarDays style={{ color: "#514073" }} /> <p>{item.deadLine}</p>
        </DeadLineInfo>

        <HashTagContainer>
          {item.tag_boardList.map((item) => {
            return <HashTag key={item.tagId}>{item.tag}</HashTag>;
          })}
        </HashTagContainer>
        <MeetInfo hasHashTags={item.tag_boardList.length > 0}>
          <CreatedDate>
            {/*             <FaPen /> */}
            {getTimeDifference(item.createdTime)}
          </CreatedDate>
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
  position: relative;
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

  margin-top: ${(props) => (props.hasHashTags ? "17px" : "50px")};
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
  border: none;
  border-radius: 50px;
  padding: 7px;
`;

const LocationInfo = styled.div`
  display: flex;
  gap: 5px;
  font-size: 16px;
  align-items: center;
  margin-bottom: 10px;
`;
const DeadLineInfo = styled.div`
  display: flex;
  gap: 5px;
  font-size: 16px;
  align-items: center;
`;
const DDayInfo = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 1;
  display: flex;
  font-size: 16px;
  align-items: center;
  background-color: white;
  border-radius: 13px;
  padding: 2px 10px;
  opacity: 50%;
  font-weight: 600;
  color: ${(props) => (props.isDday ? "#ff0000" : "#000000")};
`;
