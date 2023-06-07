import React, { useState } from "react";
import { useNavigate, useParams } from "react-router";
import styled from "styled-components";
import { Link } from "react-router-dom";

function MyPageTabs() {
  const { hostId } = useParams();
  // console.log("첫번째", hostId);
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState();

  // const [entireClicked, setEntireClicked] = useState();

  const activeClickHandler = (item) => {
    setIsActive(item);
  };

  return (
    <TabsStyles>
      <MaueBar>
        <TabButton
          className={isActive === "전체보기" ? "active" : ""}
          onClick={() => {
            activeClickHandler("전체보기");
            navigate(`/page/${hostId}`);
          }}
        >
          전체보기
        </TabButton>
        <TabButton
          className={isActive === "내 피드" ? "active" : ""}
          onClick={() => {
            activeClickHandler("내 피드");
            navigate(`/mypagefeed/${hostId}`);
          }}
        >
          내 피드
        </TabButton>
        <TabButton
          className={isActive === "내 게시글" ? "active" : ""}
          onClick={() => {
            activeClickHandler("내 게시글");
            navigate(`/mypageboard/${hostId}`);
          }}
        >
          내 게시글
        </TabButton>
        <TabButton
          className={isActive === "채팅목록" ? "active" : ""}
          onClick={() => {
            activeClickHandler("채팅목록");
          }}
        >
          채팅목록
        </TabButton>
      </MaueBar>
    </TabsStyles>
  );
}

export default MyPageTabs;

const TabsStyles = styled.div`
  width: 100%;
  background: #f5f5f5;
  border-bottom: 1px solid #d9d9d9;
  height: 50px;
  display: flex;
  align-items: center;
  padding-left: 80px;
  font-weight: 600;
  top: 0;
  left: 0;
  top: 0;
  left: 0;
`;
const MaueBar = styled.div`
  display: flex;
  width: 100%;
  /* max-width: 800px; */
`;
const TabButton = styled.button`
  margin-right: 15px;
  flex: 1;
  max-width: 100px;
  padding: 11px;
  border: none;
  outline: none;
  background: none;
  text-decoration: none;
  color: #999999;
  font-size: 15px;

  &.active {
    color: #000000;
    font-weight: 900;
  }
`;
