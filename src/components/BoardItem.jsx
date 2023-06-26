import React, { useEffect, useState, useRef } from "react";
import styled, { css } from "styled-components";
import { IoLocationSharp } from "@react-icons/all-files/io5/IoLocationSharp";
import { BiDollarCircle } from "@react-icons/all-files/bi/BiDollarCircle";
import { BsCalendar } from "@react-icons/all-files/bs/BsCalendar";
import { useNavigate } from "react-router-dom";
import { FaPen } from "@react-icons/all-files/fa/FaPen";
import { useIntersectionObserver } from "../hooks/useIntersectionObserver";

function BoardItem({
  item,
  onClick,
  photograhperInfoShow,
  MatchingStatus,
  children,
  hover,
}) {
  const [timeDifference, setTimeDifference] = useState(null);
  const [matchStatus, setMatchStatus] = useState();

  // 오늘 날짜
  const today = new Date();
  const navigate = useNavigate("");
  const getTimeDifference = (createdTime) => {
    const serverTime = new Date(createdTime);
    const currentTime = new Date();
    const timeDiff = Math.floor((currentTime - serverTime) / (1000 * 60)); // 분 단위로 시간 차이 계산

    if (timeDiff === 0) {
      return "방금 전 작성됨";
    }
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

  useEffect(() => {
    if (item.alreadyMatch && item.matchingWith) {
      return setMatchStatus("true");
    } else if (item.applyRefused) {
      return setMatchStatus("refuse");
    } else {
      return setMatchStatus("pending");
    }
  }, [item]);

  const [cardProfileImgSrc, cardProfileImgRef] = useIntersectionObserver(
    "/path/to/placeholder.jpg", // placeholder 이미지 경로
    item.hostProfileUrl
  );

  return (
    <Item key={item.boardId} onClick={onClick} hover={hover}>
      <ImageContainer img={item.boardImgUrl}>
        {item.checkMatched ? (
          <DDayInfo isDday={getDDay(item.deadLine) === "D-day"} matched="true">
            <p>매칭 완료</p>
          </DDayInfo>
        ) : (
          <DDayInfo isDday={getDDay(item.deadLine) === "D-day"}>
            <p>{getDDay(item.deadLine)}</p>
          </DDayInfo>
        )}

        {photograhperInfoShow === "no" ? (
          <PhotographerInfo button="matching">{children}</PhotographerInfo>
        ) : MatchingStatus === "on" ? (
          <MatchingStatusBox
            matchStatus={matchStatus}
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/page/${item.boardHostId}`);
            }}
          >
            {matchStatus === "true"
              ? `${item.nickName} 님과 매칭이 완료되었습니다!`
              : matchStatus === "refuse"
              ? "승인되지 않음"
              : "신청 대기 중..."}
          </MatchingStatusBox>
        ) : (
          <PhotographerInfo>
            <CardProfileImg
              src={cardProfileImgSrc}
              ref={cardProfileImgRef}
              alt="ProfileImg"
            />
            <PhotographerRole>{item.role}</PhotographerRole>
            <span>|</span>
            <PhotographerName>{item.nickName}</PhotographerName>
          </PhotographerInfo>
        )}
      </ImageContainer>

      <ContentContainer>
        <Title>{item.title}</Title>
        <LocationInfo>
          <IoLocationSharp style={{ color: "#514073" }} />
          <CardFont>{item.location}</CardFont>
          <PayInfo>
            <BiDollarCircle style={{ color: "#514073" }} />
            <CardFont>{item.pay}</CardFont>
          </PayInfo>
        </LocationInfo>
        <DeadLineInfo>
          <BsCalendar style={{ color: "#514073" }} />{" "}
          <CardFont>{item.deadLine}</CardFont>
        </DeadLineInfo>

        <HashTagContainer>
          {item.tag_boardList.map((item) => {
            return <HashTag key={item.tagId}>{item.tag}</HashTag>;
          })}
        </HashTagContainer>
        <MeetInfo hasHashTags={item.tag_boardList.length > 0}>
          <CreatedDate>
            <FaPen style={{ color: "#514073", marginRight: "10px" }} />
            {getTimeDifference(item.createdTime)}
          </CreatedDate>
        </MeetInfo>
      </ContentContainer>
    </Item>
  );
}

export default BoardItem;

const Item = styled.div`
  margin-top: 15px;
  flex-grow: 1;
  width: 100%;
  overflow: hidden;

  ${(props) =>
    props.hover !== "no" &&
    css`
      &:hover {
        transform: translateY(-10px);
        transition: transform 1s ease;
        cursor: pointer;
      }

      &:not(:hover) {
        transform: translateY(0);
        transition: transform 1s ease;
      }
    `}
`;

const CardFont = styled.p`
  font-size: 13px;
`;

const MatchingStatusBox = styled.button`
  width: 84%;
  background-color: ${(props) =>
    props.matchStatus === "true"
      ? "#8d18aa"
      : props.matchStatus === "refuse"
      ? "#e61f1f"
      : "#6c6c6c"};
  color: white;
  justify-content: center;
  align-items: center;
  border-radius: 6px;
  position: absolute;
  bottom: 0;
  left: 50%;
  font-size: 14px;
  margin-bottom: 10px;
  transform: translateX(-50%);
  text-align: center;
  padding: 9px;
  border: none;

  &:hover {
    background-color: #8c8c8c;
    border-color: #fff;
    color: #fff;
  }
`;

const ContentContainer = styled.div`
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
`;

const PhotographerInfo = styled.div`
  position: absolute;
  bottom: 0px;
  z-index: 3;
  display: flex;
  align-items: center;
  background-color: ${(props) =>
    props.button === "matching" ? "transparent" : "rgba(255, 255, 255, 0.6);"};
  padding: 10px;
  font-weight: 600;
  width: 100%;
  @media (max-width: 1200px) {
    padding: 5px;
  }
`;

const MatchingCount = styled.div`
  display: flex;
  margin-right: 10px;
  align-items: center;
`;

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  padding-bottom: 100%;
  border-radius: 4px;
  object-fit: cover;
  background-image: url(${(props) => props.img});
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  background-color: #bbbbbb;
  cursor: pointer;
  overflow: hidden;
  margin-bottom: 20px;
`;

const MatchingAcceptButton = styled.button`
  margin: auto;
  padding: 8px;
  width: 90%;
  background-color: #483767;
  color: white;
  border: none;
  border-radius: 7px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: #8c8c8c;
    border-color: #fff;
    color: #fff;
  }
`;

const Title = styled.div`
  font-weight: 600;
  font-size: 18px;
  margin-bottom: 8px;
`;

const PhotographerName = styled.div`
  font-weight: 600;
  margin-left: 8px;
  font-size: 14px;
`;

const PhotographerRole = styled.div`
  font-weight: 600;
  margin-right: 8px;
  font-size: 10px;
`;

const MeetInfo = styled.div`
  display: flex;
  align-items: center;
  @media (max-width: 768px) {
    margin-top: 20px;
  }
`;

const CreatedDate = styled.div`
  color: #666;
  font-size: 13px;
  margin-top: 10px;
`;

const HashTagContainer = styled.div`
  padding-top: 10px;
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
`;

const HashTag = styled.div`
  background-color: #514073;
  color: white;
  border: none;
  border-radius: 50px;
  padding: 7px;
  font-size: 13px;
`;

const LocationInfo = styled.div`
  display: flex;
  gap: 5px;
  font-size: 16px;
  align-items: center;
  margin-bottom: 10px;
  flex-wrap: wrap;
`;
const DeadLineInfo = styled.div`
  display: flex;
  gap: 5px;
  font-size: 14px;
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
  opacity: 65%;
  font-weight: 600;
  color: ${(props) => (props.isDday || props.matched ? "#ff0000" : "#000000")};
`;

const CardProfileImg = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  background-image: url(${(props) => props.src});
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  background-color: #bbbbbb;
  margin-right: 3%;
  cursor: pointer;
  @media (max-width: 1200px) {
    width: 30px;
    height: 30px;
  }
`;
const PayInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 16px;
`;
