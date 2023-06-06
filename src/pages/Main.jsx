import React, { useState } from "react";
import styled from "styled-components";
import Card from "../components/Card";
import { useMutation, useQuery } from "react-query";
import { main } from "../apis/main/main";
import LoadingSpinner from "../components/LoadingSpinner";
import { deleteUserAxios } from "../apis/auth/login";
import { useNavigate } from "react-router-dom";
import BoardItem from "../components/BoardItem";
import MainBoard from "../components/MainBoard";

function Main() {
  const { isLoading, isError, data } = useQuery("main", main);
  const navigate = useNavigate();
  const sendPasswordMutation = useMutation(deleteUserAxios, {
    onSuccess: () => {
      alert("회원탈퇴 성공!");
      navigate("/");
    },
    onError: (error) => {
      alert("회원탈퇴를 실패했습니다!");
    },
  });
  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return <h1>{isError}</h1>;
  }
  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return <h1>{isError}</h1>;
  }

  if (!data) {
    return null; // 또는 로딩 상태를 표시하는 컴포넌트를 반환하거나, 기본적인 화면 구조를 보여줄 수 있습니다.
  }

  const recommendataion = data.eachRoleUsersList;
  const board = data.boardList;
  console.log("data", data);

  return (
    <>
      <MainContainer>
        <MainImg src="img/mainImg_test.jpeg"></MainImg>
        <MainBody>
          {/* 당신을 위한 맞춤 추천 카테고리 */}
          <CategoryContainer>
            <CardGroupName>
              <CardName>For You</CardName>
              <MoreButton
                onClick={() => {
                  navigate("/feeds");
                }}
              >
                더보기 ▶
              </MoreButton>
              {/*          <BiSolidRightArrow /> */}
            </CardGroupName>
            <CardContainer>
              {recommendataion?.map((item) => {
                return <Card key={item.userId} user={item} />;
              })}
            </CardContainer>
          </CategoryContainer>
          <CategoryContainer>
            <CardGroupName>
              <CardName>Join with me</CardName>
              <MoreButton
                onClick={() => {
                  navigate("/board");
                }}
              >
                더보기 ▶
              </MoreButton>
            </CardGroupName>
            <BoardContainer>
              {board?.map((item) => {
                return <MainBoard key={item.boardId} board={item} />;
              })}
            </BoardContainer>
          </CategoryContainer>
        </MainBody>
      </MainContainer>
    </>
  );
}

export default Main;
const MainContainer = styled.div`
  /*  margin: auto 50px;
  @media (min-width: 1000px) {
    margin: auto 100px;
  }
  @media (min-width: 1200px) {
    margin: auto 100px;
  } */
`;

const MainImg = styled.img`
  width: 100%;
  margin-bottom: 30px;
`;

const MainBody = styled.div`
  margin: auto 100px;
`;

const CategoryContainer = styled.div`
  margin-bottom: 40px;
`;

const CardGroupName = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 20px;
`;

const CardName = styled.p`
  font-size: 25px;
  font-weight: 700;
`;

const MoreButton = styled.div`
  border: none;
  color: #515151;
  cursor: pointer;
  font-weight: 600;
`;

const CardContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
`;
const BoardContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr); /* 한 줄에 4개의 컬럼 */
  gap: 30px;
`;
