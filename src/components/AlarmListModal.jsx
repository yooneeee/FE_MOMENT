import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router";
import LoadingSpinner from "./LoadingSpinner";

function AlarmListModal({ alarmList, showAlarmList }) {
  const [timeDifference, setTimeDifference] = useState(null);
  const navigate = useNavigate();
  console.log("alarmList", alarmList);
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
  /* const { isLoading, isError, data } = useQuery("likeList", () =>
    feedLikeListAxios(photoId)
  );
  console.log("Data", data); */
  /* const handleUserClick = (userId) => {
    showAlarmList();
    navigate(`/page/${userId}`);
  };
   if (isLoading) {
    return <LoadingSpinner />;
  }
  if (isError) {
    return <p>오류가 발생하였습니다!</p>;
  } */
  useEffect(() => {
    alarmList.forEach((item) => {
      const diff = getTimeDifference(item.createdTime);
      setTimeDifference((prevTimeDifference) => ({
        ...prevTimeDifference,
        [item.id]: diff,
      }));
    });
  }, [alarmList]);
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
          {alarmList?.map((item) => {
            return (
              <li>
                <FollowItem
                  onClick={() => navigate(`/chattest/${item.senderId}`)}
                  key={item.receiverNickName}
                >
                  <UserImage src={item.senderProfileImg} />
                  <UserInfo>
                    <span>{item.senderNickName}님이 메세지를 보냈습니다.</span>
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
  margin-right: 0.5rem;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  span {
    font-weight: bold;
    font-size: 15px;
    color: #333;
    margin-right: 0.5rem;
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
