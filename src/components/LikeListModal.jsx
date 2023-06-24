import React from "react";
import { useQuery } from "react-query";
import styled from "styled-components";
import { IoArrowBack } from "@react-icons/all-files/io5/IoArrowBack";
import { useNavigate } from "react-router";
import { feedLikeListAxios } from "../apis/feed/feedLikeListAxios";
import LoadingSpinner from "./LoadingSpinner";

function LikeListModal({ photoId, showLikeList }) {
  const navigate = useNavigate();
  const { isLoading, isError, data } = useQuery("likeList", () =>
    feedLikeListAxios(photoId)
  );
  console.log("Data", data);
  const handleUserClick = (userId) => {
    showLikeList();
    navigate(`/page/${userId}`);
  };
  if (isLoading) {
    return <LoadingSpinner />;
  }
  if (isError) {
    return <p>오류가 발생하였습니다!</p>;
  }
  return (
    <div>
      <Outside onClick={showLikeList} />
      <ModalWrap>
        <ModalHeader>
          <IoArrowBack
            style={{
              fontSize: "16px",
              cursor: "pointer",
            }}
            onClick={showLikeList}
          />
          <p>좋아요 목록</p>
          <button onClick={showLikeList}>x</button>
        </ModalHeader>
        {data.length === 0 && (
          <NoLikesMessage>좋아요를 누른 사람이 없습니다.</NoLikesMessage>
        )}
        <FollowList>
          {data?.map((item) => {
            return (
              <li>
                <FollowItem
                  onClick={() => handleUserClick(item.userId)}
                  key={item.nickname}
                >
                  <UserImage src={item.profileUrl} />
                  <UserInfo>
                    <span>{item.nickName}</span>
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
export default LikeListModal;

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
