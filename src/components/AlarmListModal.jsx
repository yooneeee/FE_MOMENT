import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";

function AlarmListModal({ alarmList, showAlarmList }) {
  console.log(alarmList);
  const navigate = useNavigate();
  const userId = useSelector((state) => state.user.userId);
  const groupedAlarmList = [];
  let currentSender = null;

  alarmList.forEach((item) => {
    if (item.senderNickName !== currentSender) {
      currentSender = item.senderNickName;
      groupedAlarmList.push([item]);
    } else {
      groupedAlarmList[groupedAlarmList.length - 1].push(item);
    }
  });
  const getTimeDifference = (createdTime) => {
    const serverTime = new Date(createdTime);
    const currentTime = new Date();
    const timeDiff = Math.floor((currentTime - serverTime) / (1000 * 60));

    if (timeDiff === 0) {
      return "방금 전 ";
    }
    if (timeDiff < 60) {
      return `${timeDiff}분 전 `;
    } else if (timeDiff >= 60 && timeDiff < 1440) {
      const hoursDiff = Math.floor(timeDiff / 60);
      return `${hoursDiff}시간 전  `;
    } else {
      const daysDiff = Math.floor(timeDiff / 1440);
      return `${daysDiff}일 전 `;
    }
  };
  const handleFollowItemClick = (groupId) => {
    const group = groupedAlarmList.find(
      (item) => item[0].createdAt === groupId
    );

    if (
      group[0].matchStatus === "MATCH_APPLY" ||
      group[0].matchStatus === "MATCH_ACCEPT"
    ) {
      navigate(`/matching/${userId}`);
    } else if (typeof group[0].matchStatus === "undefined") {
      navigate(`/chattest/${group[0].senderId}`);
    }
    showAlarmList();
  };
  console.log("group", groupedAlarmList);

  return (
    <div>
      <Outside onClick={showAlarmList} />
      <ModalWrap>
        <ModalHeader>
          <IoArrowBack
            style={{
              fontSize: "16px",
              cursor: "pointer",
            }}
            onClick={showAlarmList}
          />
          <p>알림 목록</p>
          <button onClick={showAlarmList}>x</button>
        </ModalHeader>
        {alarmList.length === 0 && (
          <NoLikesMessage>알림이 없습니다.</NoLikesMessage>
        )}
        <FollowList>
          {groupedAlarmList.reverse().map((group) => {
            const timeDifference = getTimeDifference(group[0].createdAt);
            const latestTime = new Date(
              Math.max(...group.map((item) => new Date(item.createdAt)))
            );
            console.log(group[0].matchStatus);
            const latestTimeDifference = getTimeDifference(latestTime);
            let message;
            if (group[0].matchStatus === "MATCH_APPLY") {
              message = `${group[0].userNickName}님이 매칭을 신청하셨습니다.`;
            } else if (group[0].matchStatus === "MATCH_ACCEPT") {
              message = `${group[0].userNickName}님이 매칭을 수락하였습니다.`;
            } else {
              message = `${group[0].senderNickName}님이 메세지를 보냈습니다.`;
            }
            /*   group[0].matchStatus === "MATCH_APPLY"
                ? `${group[0].userNickName}님이 매칭을 신청하셨습니다.`
                : `${group[0].senderNickName}님이 메세지를 보냈습니다.`; */
            return (
              <li key={group[0].createdAt}>
                <FollowItem
                  onClick={() => {
                    handleFollowItemClick(group[0].createdAt);
                    showAlarmList();
                  }}
                >
                  <UserImage
                    src={group[0].senderProfileImg || group[0].userProfileImg}
                  />
                  <UserInfo>
                    <span>{message}</span>
                    {group[0].createdAt && <p>{latestTimeDifference}</p>}
                  </UserInfo>
                </FollowItem>
              </li>
            );
          })}
        </FollowList>
      </ModalWrap>
    </div>
  );
}
export default AlarmListModal;

const Outside = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.4);
  width: 100%;
  height: 100%;
  z-index: 5;
`;
const ModalWrap = styled.div`
  width: 360px;
  height: 400px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 10px 0;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
  background-color: white;
  border-radius: 12px;
`;
const FollowList = styled.ul`
  list-style: none;
  width: 100%;
  padding-left: 1rem;
  font-size: 1.2rem;
  color: #333;
  overflow-y: auto;
`;
const FollowItem = styled.li`
  display: flex;
  align-items: center;
  height: 60px;
  cursor: pointer;
  border-radius: 7px;
  &:hover {
    background-color: #f1f1f1;
    opacity: 70%;
  }
`;

const UserImage = styled.img`
  background-size: cover;
  background-position: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 1rem;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-wrap: wrap;

  span {
    font-weight: bold;
    font-size: 15px;
    color: #000000;
    margin-right: 10px;
  }
  p {
    font-size: 15px;
    color: #6b6b6b;
  }
`;
const ModalHeader = styled.div`
  display: flex;
  width: 100%;
  min-height: 40px;
  border-bottom: 1px solid #dbdbdb;
  padding: 0 16px;
  justify-content: space-between;
  align-items: center;

  p {
    font-size: 16px;
    font-weight: bold;
  }

  button {
    background-color: white;
    border: none;
    font-size: 1.1rem;
    font-weight: bold;
    color: #483767;
    &:hover {
      opacity: 60%;
    }
  }
`;
const NoLikesMessage = styled.span`
  font-size: 1rem;
  color: #333;
  margin: auto;
`;
