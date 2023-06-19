import React, { useState } from "react";
import { useNavigate, useParams } from "react-router";
import styled from "styled-components";
import Swal from "sweetalert2";

function MyPageTabs({ pageName }) {
  const { hostId } = useParams();
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState("");

  const activeClickHandler = (item) => {
    setIsActive(item);
  };

  return (
    <TabsStyles>
      <MaueBar>
        <TabButton
          className={pageName === "전체보기" ? "active" : ""}
          onClick={() => {
            navigate(`/page/${hostId}`);
            activeClickHandler("전체보기");
          }}
        >
          전체보기
        </TabButton>
        <TabButton
          className={pageName === "내 피드" ? "active" : ""}
          onClick={() => {
            navigate(`/mypagefeed/${hostId}`);
            activeClickHandler("내 피드");
          }}
        >
          내 피드
        </TabButton>
        <TabButton
          className={pageName === "내 게시글" ? "active" : ""}
          onClick={() => {
            navigate(`/mypageboard/${hostId}`);
            activeClickHandler("내 게시글");
          }}
        >
          내 게시글
        </TabButton>
        <TabButton
          className={pageName === "매칭목록" ? "active" : ""}
          // onClick={() => {
          //   navigate(`/matching/${hostId}`);
          //   activeClickHandler("매칭목록");
          // }}
          onClick={() => {
            Swal.fire({
              icon: "error",
              text: "현재 준비 중인 서비스입니다. 불편을 끼쳐드려 죄송합니다.",
              confirmButtonText: "확인",
            });
          }}
        >
          매칭목록
        </TabButton>
        <TabButton
          className={pageName === "채팅목록" ? "active" : ""}
          onClick={() => {
            navigate(`/chatlist/${hostId}`);
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
  @media (max-width: 768px) {
    padding-left: 0px;
  }
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
  @media (max-width: 768px) {
    margin-right: 10px;
  }
`;
