import React from "react";
import styled from "styled-components";
import { IoArrowBack } from "react-icons/io5";
import { AiOutlineClose } from "react-icons/ai";
import { useEffect } from "react";

function MatchingList({ userId, showFollow }) {
  useEffect(() => {
    document.body.style.overflow = "hidden"; // Prevent scrolling on the entire page
    return () => {
      document.body.style.overflow = "auto"; // Restore scrolling when the modal is closed
    };
  }, []);
  return (
    <div>
      <Outside onClick={showFollow} />
      <ModalWrap>
        <ModalHeader>
          <IoArrowBack onClick={showFollow} />
          <MatchingListTitle>매칭 신청 목록</MatchingListTitle>
          <button onClick={showFollow}>
            <AiOutlineClose />
          </button>
        </ModalHeader>

        <FollowList>
          <FollowItem>
            <UserImage src="/img/profile_12.jpeg" />
            <UserInfo>
              <span>Jun</span>
            </UserInfo>

            <ButtonContainer>
              <AllowButton>수락하기</AllowButton>
              <AllowButton name="refuse">거절하기</AllowButton>
            </ButtonContainer>
          </FollowItem>

          <FollowItem>
            <UserImage src="/img/profile_10.jpeg" />
            <UserInfo>
              <span>지윤</span>
            </UserInfo>

            <ButtonContainer>
              <AllowButton>수락하기</AllowButton>
              <AllowButton name="refuse">거절하기</AllowButton>
            </ButtonContainer>
          </FollowItem>

          <FollowItem>
            <UserImage src="/img/profile_6.jpeg" />
            <UserInfo>
              <span>미녕</span>
            </UserInfo>

            <ButtonContainer>
              <AllowButton>수락하기</AllowButton>
              <AllowButton name="refuse">거절하기</AllowButton>
            </ButtonContainer>
          </FollowItem>
        </FollowList>
      </ModalWrap>
    </div>
  );
}

export default MatchingList;

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
  width: 400px;
  height: 400px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 10px;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
  background-color: white;
  border-radius: 12px;

  animation: modal-show 0.3s;
`;

const MatchingListTitle = styled.p`
  text-align: center;
`;

const ButtonContainer = styled.div`
  display: flex;
  margin: 0 10px 0 auto;
  gap: 5px;
`;

const AllowButton = styled.button`
  padding: 10px;
  background-color: #483767;
  background-color: ${(props) =>
    props.name === "refuse" ? "#696969" : "#483767"};
  border: none;
  color: white;
  border-radius: 7px;
`;

const FollowList = styled.ul`
  list-style: none;
  padding-left: 1rem;
  font-size: 1.2rem;
  color: #333;
  overflow-y: auto;
  width: 100%;
`;
const FollowItem = styled.li`
  display: flex;
  align-items: center;
  height: 60px;
  cursor: pointer;
`;

const UserImage = styled.img`
  object-fit: cover;
  background-repeat: no-repeat;
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
    font-size: 1rem;
    color: #333;
    margin-right: 0.5rem;
  }
`;
const ModalHeader = styled.div`
  display: flex;
  width: 100%;
  height: 42px;
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
    font-size: 1rem;
    font-weight: bold;
    color: #359fe5;
    &:hover {
      color: #333;
    }
  }
`;
